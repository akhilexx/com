# Pisces Shirts E-commerce

This repository contains a Medusa backend and a Next.js storefront configured to sell shirts online. The project is split into two folders:

- **backend** – Medusa server containing products and checkout logic.
- **backend-storefront** – Next.js 15 storefront for customers.

## Local Setup

1. Ensure Node.js 20 and PostgreSQL are installed.
2. Copy `backend/.env.template` to `backend/.env` and fill in the database connection.
3. Install dependencies (requires internet access):
   ```bash
   cd backend && npm install
   cd ../backend-storefront && npm install
   ```
4. Seed demo data:
   ```bash
   cd ../backend
   npm run seed
   ```
5. Run both apps:
   ```bash
   npm run dev  # in backend
   npm run dev  # in backend-storefront
   ```

## Deployment

Deploy the backend and storefront separately. The frontend expects the backend to run on `http://localhost:9000` by default. Update environment variables as needed for production.

## Testing

Run Medusa's integration tests from the backend folder:
```bash
npm run test:integration:http
```
Tests require installed dependencies and may not run in restricted environments.
