# Traders Connect

Traders Connect is a community platform for prop firm and retail traders. The project
includes a Next.js web frontend, an Express API backend powered by SQLite, and a basic
SwiftUI iOS application skeleton. This sample demonstrates the core architecture with
authentication, profile loading and firm management.

## Getting Started

1. `cd server && npm install` to install API dependencies
2. `cp server/.env.example server/.env` and set a secure `JWT_SECRET`
3. `npm start` inside `server` to run the API
4. In another terminal `cd web && npm install`
5. `cp web/.env.local.example web/.env.local` and adjust `NEXT_PUBLIC_API_URL`
6. `npm run dev` inside `web` to start the frontend
