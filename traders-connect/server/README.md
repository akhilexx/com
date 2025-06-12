# Traders Connect API

This Express server provides authentication and basic firm management for the
Traders Connect platform. It uses a local SQLite database managed with
`better-sqlite3` and JWT based authentication.

## Available Scripts

- `npm run dev` – start the server with watch mode
- `npm start` – start the API server

Create a `.env` file based on `.env.example` and set `JWT_SECRET`.
