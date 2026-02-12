// Example: PouchDB client-side setup for POS offline-first sync
// Requires: npm install pouchdb pouchdb-find pouchdb-authentication

import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

// Configure local DBs
export const db = new PouchDB('rapidpos_local'); // main local DB

// Example design doc and index creation
export async function setupIndexes() {
  try {
    await db.createIndex({ index: { fields: ['type', 'created_at'] }});
    await db.createIndex({ index: { fields: ['sku'] }});
  } catch (e) {
    console.warn('Index creation failed', e);
  }
}

// Setup replication to remote CouchDB
export function startReplication(remoteCouchUrl, options = {}) {
  // options: { username, password, live, retry }
  const remote = new PouchDB(remoteCouchUrl, {
    skip_setup: true,
    auth: options.username ? { username: options.username, password: options.password } : undefined,
  });

  // two-way continuous sync
  const sync = db.sync(remote, {
    live: options.live ?? true,
    retry: options.retry ?? true,
    batch_size: 50,
  }).on('change', info => {
    console.log('PouchDB sync change', info);
  }).on('paused', err => {
    console.log('PouchDB sync paused', err);
  }).on('active', () => {
    console.log('PouchDB sync active');
  }).on('denied', err => {
    console.error('PouchDB sync denied', err);
  }).on('complete', info => {
    console.log('PouchDB sync complete', info);
  }).on('error', err => {
    console.error('PouchDB sync error', err);
  });

  return sync;
}

// Example: add a sales transaction locally (works offline)
export async function createSale(sale) {
  // sale must include _id (UUID), type:'sale', created_at
  try {
    await db.put(sale);
    return { ok: true, id: sale._id };
  } catch (e) {
    console.error('Failed to create local sale', e);
    return { ok: false, error: e };
  }
}

export default {
  db,
  setupIndexes,
  startReplication,
  createSale,
};