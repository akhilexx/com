# Pisces Top E-commerce Storefront - Advanced Implementation Guide

This document continues from the basic setup documentation and provides detailed information about advanced features and customization options in the Pisces Top storefront.

## Table of Contents

1. [Advanced Theme Customization](#advanced-theme-customization)
   - [Animations and Effects](#animations-and-effects)
   - [Custom Components](#custom-components)
2. [Product Features Implementation](#product-features-implementation)
   - [Product Reviews System](#product-reviews-system)
   - [Custom Sort Functionality](#custom-sort-functionality)
3. [Layout Customization](#layout-customization)
   - [Header and Navigation](#header-and-navigation)
   - [Footer Customization](#footer-customization)
   - [Side Menu Implementation](#side-menu-implementation)
4. [Cart and Checkout Enhancements](#cart-and-checkout-enhancements)
   - [Cart Icon Customization](#cart-icon-customization)
   - [Checkout Flow Optimization](#checkout-flow-optimization)
5. [Performance Optimization](#performance-optimization)
6. [Testing](#testing)
7. [Maintenance and Updates](#maintenance-and-updates)

## Advanced Theme Customization

### Animations and Effects

The Pisces Top storefront includes several custom animations and effects:

1. **Sparkle Effect**: Used on product prices and important elements:
   ```css
   @keyframes sparkle {
     0% { transform: scale(0); opacity: 0; }
     50% { transform: scale(1); opacity: 0.8; }
     100% { transform: scale(0); opacity: 0; }
   }
   
   .sparkle-effect {
     position: relative;
     overflow: hidden;
   }
   
   .sparkle-effect::after {
     content: '';
     position: absolute;
     width: 100%;
     height: 100%;
     background-image: url('data:image/svg+xml,%3Csvg...');
     animation: sparkle 1.5s ease-in-out infinite;
   }
   ```

2. **Gold Gradient Effect**: Applied to important buttons and text:
   ```css
   .gold-gradient-text {
     background: linear-gradient(to right, var(--gold-accent), var(--gold-primary), var(--gold-secondary));
     -webkit-background-clip: text;
     background-clip: text;
     color: transparent;
     display: inline-block;
   }
   ```

3. **Hover Animations**: Applied to interactive elements:
   ```css
   .card-hover {
     @apply transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 hover:border-pisces-secondary;
   }
   ```

To add new animations:
1. Define the keyframes in `src/styles/globals.css`
2. Create utility classes that apply the animations
3. Apply these classes to the desired components

### Custom Components

Key custom components include:

1. **GoldenFish Animation**: A floating fish animation component:
   ```tsx
   // src/components/GoldenFish.tsx
   export const GoldenFish = () => {
     return (
       <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="fish-container animate-float">
           {/* Fish SVG and animation logic */}
         </div>
       </div>
     );
   };
   ```

2. **StyledDropdown**: A custom dropdown component for sorting and filtering:
   ```tsx
   // src/modules/common/components/styled-dropdown/index.tsx
   const StyledDropdown = ({
     title,
     items,
     value,
     handleChange,
     "data-testid": dataTestId,
   }: StyledDropdownProps) => {
     // Implementation details
   };
   ```

## Product Features Implementation

### Product Reviews System

To implement the product reviews system:

1. **Backend Implementation**:
   - Create a reviews table in your database
   - Implement API endpoints for submitting and retrieving reviews
   - Add admin functionality for review moderation

2. **Frontend Implementation**:
   - Create a `ProductReviews` component:
   ```tsx
   // src/modules/products/components/product-reviews/index.tsx
   export default function ProductReviews({
     productId,
   }: ProductReviewsProps) {
     const [reviews, setReviews] = useState<StoreProductReview[]>([]);
     const [rating, setRating] = useState(0);
     // Implementation details
   }
   ```

   - Create a review form component:
   ```tsx
   // src/modules/products/components/product-reviews/form.tsx
   export default function ProductReviewsForm({
     productId,
   }: ProductReviewsFormProps) {
     // Form implementation
   }
   ```

   - Display reviews on the product page

### Custom Sort Functionality

The custom sort functionality is implemented using the `StyledDropdown` component:

1. **SortProducts Component**:
   ```tsx
   // src/modules/store/components/refinement-list/sort-products/index.tsx
   const SortProducts = ({
     "data-testid": dataTestId,
     sortBy,
     setQueryParams,
   }: SortProductsProps) => {
     const handleChange = (value: string) => {
       setQueryParams("sortBy", value as SortOptions);
     };
     
     return (
       <StyledDropdown
         title="Sort by"
         items={sortOptions}
         value={sortBy}
         handleChange={handleChange}
         data-testid={dataTestId}
       />
     );
   };
   ```

2. **Integration with Product Listing**:
   - The sort component is included in the product listing page
   - Sort parameters are passed to the API to retrieve sorted products

## Layout Customization

### Header and Navigation

The header includes:
- Logo
- Navigation menu
- Search functionality
- Cart icon with item count
- Account link

To customize:
1. Edit `src/modules/layout/components/header/index.tsx`
2. Modify the layout and styling

### Footer Customization

The footer includes:
- Logo and branding
- Social media links
- Categories navigation
- Collections navigation
- About us section
- Copyright information

To customize the footer:
1. Edit `src/modules/layout/templates/footer/index.tsx`
2. Add or remove sections as needed
3. Update the styling to match your brand

Example footer structure:
```tsx
<footer className="border-t border-ui-border-base w-full bg-gradient-to-b from-white to-pisces-light">
  <div className="content-container flex flex-col w-full">
    <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-12">
      {/* Brand section */}
      <div className="flex flex-col gap-y-3 min-w-[200px] max-w-[300px]">
        {/* Logo and description */}
      </div>
      
      {/* Navigation links section */}
      <div className="text-small-regular gap-8 md:gap-x-12 grid grid-cols-2 sm:grid-cols-3">
        {/* Categories */}
        {/* Collections */}
        {/* About Us */}
      </div>
    </div>
    
    {/* Copyright footer */}
    <div className="flex w-full py-4 border-t border-ui-border-base justify-center text-ui-fg-muted">
      <Text className="txt-compact-small">
        © {new Date().getFullYear()} Pisces Top. All rights reserved.
      </Text>
    </div>
  </div>
</footer>
```

### Side Menu Implementation

The side menu provides mobile navigation:
- Hamburger menu icon
- Slide-out menu with navigation options
- Close button

To customize:
1. Edit `src/modules/layout/components/side-menu/index.tsx`
2. Update the styling and content

## Cart and Checkout Enhancements

### Cart Icon Customization

The cart icon includes:
- Shopping bag icon
- Item count badge
- Dropdown with cart contents

Implementation:
```tsx
// src/modules/layout/components/cart-dropdown/index.tsx
<LocalizedClientLink
  className="relative flex items-center gap-x-2 h-full"
  href="/cart"
  onClick={openAndCancel}
  data-testid="cart-button"
>
  <ShoppingBag />
  {itemCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-pisces-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
      {itemCount}
    </span>
  )}
</LocalizedClientLink>
```

### Checkout Flow Optimization

The checkout process includes:
1. Cart review
2. Customer information
3. Shipping selection
4. Payment
5. Order confirmation

To customize:
1. Edit components in `src/app/[countryCode]/(checkout)/`
2. Update the layout and styling

## Performance Optimization

To optimize performance:
1. **Image Optimization**:
   - Use Next.js Image component for automatic optimization
   - Set appropriate sizes and loading priorities

2. **Code Splitting**:
   - Use dynamic imports for large components
   - Implement lazy loading for below-the-fold content

3. **Server-side Rendering**:
   - Utilize Next.js SSR for critical pages
   - Implement ISR (Incremental Static Regeneration) for product pages

## Testing

Implement comprehensive testing:
1. **Unit Tests**:
   - Test individual components
   - Test utility functions

2. **Integration Tests**:
   - Test component interactions
   - Test API integrations

3. **E2E Tests**:
   - Test complete user flows
   - Test checkout process

## Maintenance and Updates

Regular maintenance tasks:
1. Update dependencies
2. Monitor for security vulnerabilities
3. Keep in sync with Medusa core updates
4. Perform regular backups of your database

For major updates:
1. Test in a staging environment
2. Implement updates incrementally
3. Validate all functionality after updates

---

This advanced implementation guide provides detailed information about customizing and extending the Pisces Top storefront. Use these guidelines to create a unique shopping experience tailored to your brand's needs. 