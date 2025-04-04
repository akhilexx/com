# Pisces Top E-commerce Storefront - Setup Documentation

This document provides a comprehensive guide to setting up the Pisces Top e-commerce storefront. The application is built on Medusa, a powerful headless commerce engine, with a Next.js frontend that has been customized with a beautiful gold and pink fish-themed design.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
   - [Setting up Medusa Backend](#setting-up-medusa-backend)
   - [Setting up Next.js Storefront](#setting-up-nextjs-storefront)
3. [Configuration](#configuration)
   - [Environment Variables](#environment-variables)
   - [API Keys](#api-keys)
4. [Running the Application](#running-the-application)
5. [Customization](#customization)
   - [Theme Customization](#theme-customization)
   - [Component Styling](#component-styling)
6. [Key Features Implementation](#key-features-implementation)
   - [Product Display](#product-display)
   - [Cart Functionality](#cart-functionality)
   - [Checkout Process](#checkout-process)
   - [User Authentication](#user-authentication)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v20 or later
- Git
- npm or yarn package manager
- PostgreSQL database (for Medusa backend)

## Installation

### Setting up Medusa Backend

1. **Clone the Medusa Application Repository**:
   ```bash
   git clone https://github.com/your-repo/pisces-medusa-backend.git
   cd pisces-medusa-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up the Database**:
   Create a PostgreSQL database for your application. Then configure the connection in your `.env` file (see Configuration section).

4. **Seed the Database**:
   ```bash
   npm run seed
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

### Setting up Next.js Storefront

1. **Clone the Next.js Storefront Repository**:
   ```bash
   git clone https://github.com/your-repo/PiscesTop-storefront.git
   cd PiscesTop-storefront
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy the template environment file and customize it:
   ```bash
   cp .env.template .env.local
   ```

## Configuration

### Environment Variables

For the **Medusa Backend**, create a `.env` file with:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/medusa-db
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
ADMIN_CORS=http://localhost:7000
STORE_CORS=http://localhost:8000
```

For the **Next.js Storefront**, edit the `.env.local` file:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
```

### API Keys

To obtain the publishable API key:
1. Start your Medusa server
2. Log in to the Medusa Admin dashboard
3. Navigate to Settings → Publishable API Keys
4. Create a new key or copy an existing one
5. Add this key to your storefront's `.env.local` file

## Running the Application

1. **Start the Medusa Backend**:
   ```bash
   cd pisces-medusa-backend
   npm run dev
   ```

2. **Start the Next.js Storefront**:
   ```bash
   cd PiscesTop-storefront
   npm run dev
   ```

3. Access the storefront at `http://localhost:8000`
4. Access the admin dashboard at `http://localhost:7001`

## Customization

### Theme Customization

The Pisces Top storefront uses a custom gold and pink fish theme. The theme colors are defined in the `tailwind.config.js` file:

```javascript
colors: {
  pisces: {
    light: "#FCE7F3",
    primary: "#EC4899",
    secondary: "#F472B6",
    accent: "#DB2777",
    dark: "#9D174D"
  },
  gold: {
    light: "#FFF2CC",
    primary: "#FFD700",
    secondary: "#F1C232",
    accent: "#DAA520",
    dark: "#B8860B"
  }
}
```

To modify the theme:
1. Edit the color values in `tailwind.config.js`
2. Add additional theme-specific variables if needed

### Component Styling

Custom component styles are defined in `src/styles/globals.css` and include:

- Custom button styles (`.btn-primary`, `.btn-secondary`, etc.)
- Gold gradient effects (`.gold-gradient-text`)
- Hover animations (`.gold-button-hover`)
- Border effects (`.gold-border`)

You can customize these styles to match your brand's aesthetic.

## Key Features Implementation

### Product Display

Products are displayed using the `ProductPreview` component, which includes:
- Product images with hover effects
- Product title and description
- Price display with a sparkle effect
- "Add to Cart" functionality

To customize the product display:
1. Edit `src/modules/products/components/product-preview/index.tsx`
2. Modify the styling and layout as needed

### Cart Functionality

The cart functionality is implemented using:
- The `CartDropdown` component for quick cart access
- `MobileActions` for mobile cart interaction
- API calls to the Medusa backend for cart operations

To modify cart behavior:
1. Edit `src/modules/layout/components/cart-dropdown/index.tsx`
2. Update the cart display and interaction logic

### Checkout Process

The checkout process uses Medusa's built-in functionality with a customized UI:
1. Cart review
2. Shipping address entry
3. Delivery method selection
4. Payment processing
5. Order confirmation

To customize the checkout:
1. Edit components in `src/app/[countryCode]/(checkout)/`
2. Update the layout and styling to match your brand

### User Authentication

User authentication includes:
- Account creation
- Login/logout functionality
- Password reset
- Order history viewing

## Deployment

For production deployment:

1. **Build the Medusa Backend**:
   ```bash
   cd pisces-medusa-backend
   npm run build
   ```

2. **Build the Next.js Storefront**:
   ```bash
   cd PiscesTop-storefront
   npm run build
   ```

3. Deploy both applications to your preferred hosting provider.

## Troubleshooting

Common issues and solutions:

- **API Connection Errors**: Ensure your environment variables are correctly set and the Medusa backend is running.
- **Styling Issues**: Check for CSS conflicts in the tailwind configuration or custom styles.
- **Missing Product Data**: Verify that your database is properly seeded and the API is returning the expected data.

## Contributing

To contribute to the Pisces Top project:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request with a detailed description of your changes

---

This documentation provides a comprehensive guide to setting up and customizing the Pisces Top e-commerce storefront. For additional support, please refer to the [Medusa documentation](https://docs.medusajs.com/) or reach out to the development team. 