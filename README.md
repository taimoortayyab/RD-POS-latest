# RD-POS — PWA / Offline-first scaffold (feature/pwa-offline)

This branch adds an initial PWA + offline-first scaffold for the RD-POS project:
- Vue 3 + Vite frontend wiring (assumes existing UI integration)
- PouchDB client example for offline storage and replication
- Minimal service worker for caching + network-first API strategy
- docker-compose for a staging demo (MySQL, CouchDB, Redis, Laravel app)
- .env.example with placeholders

What I need from you to proceed:
- Confirm sync approach: CouchDB + PouchDB (recommended) or a Laravel-only queued sync.
- Confirm whether you want me to deploy to my hosted staging or provide SSH for your server.
- Printer model(s) for printing demos (ESC/POS / WebUSB / network).
- Confirm no secrets (.env) are in the repo (or upload sanitized .env.example).

After your confirmation I will:
- Push these scaffold files into feature/pwa-offline.
- Build & deploy a staging demo (or give you docker-compose to run locally).
- Provide login credentials for a demo user and instructions to test offline sync.