# Implementing Product Reviews in Pisces Top Storefront

This guide provides a detailed walkthrough for implementing a product review system in the Pisces Top e-commerce application. This feature allows customers to submit reviews for products and view reviews from other customers.

## Table of Contents

1. [Overview](#overview)
2. [Backend Implementation](#backend-implementation)
   - [Database Schema](#database-schema)
   - [API Endpoints](#api-endpoints)
   - [Review Moderation](#review-moderation)
3. [Frontend Implementation](#frontend-implementation)
   - [Review Display Component](#review-display-component)
   - [Review Form Component](#review-form-component)
   - [Rating Display](#rating-display)
4. [Integration with Product Pages](#integration-with-product-pages)
5. [Testing the Review System](#testing-the-review-system)

## Overview

The product review system consists of:
- Backend functionality to store and retrieve reviews
- Admin capabilities to moderate reviews
- Frontend components to display and submit reviews
- Integration with the product detail pages

## Backend Implementation

### Database Schema

First, define the review model in your Medusa backend:

```typescript
// src/models/product-review.ts
import { BaseEntity } from "@medusajs/medusa"
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm"
import { Product } from "@medusajs/medusa"

@Entity()
export class ProductReview extends BaseEntity {
  @Column({ type: "varchar" })
  title: string

  @Column({ type: "varchar" })
  content: string

  @Column({ type: "int" })
  rating: number

  @Column({ type: "varchar" })
  product_id: string

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product

  @Column({ nullable: true })
  customer_id: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column({ default: false })
  approved: boolean

  @Column({ nullable: true })
  email: string
}
```

### API Endpoints

Implement the following API endpoints:

1. **Get Product Reviews**:
```typescript
// src/api/routes/store/products/get-product-reviews.ts
export default async (req, res) => {
  const { id } = req.params
  const { limit, offset } = req.query

  const reviewService = req.scope.resolve("productReviewService")
  
  const [reviews, count, average] = await Promise.all([
    reviewService.list(
      { product_id: id, approved: true },
      { limit, offset }
    ),
    reviewService.count({ product_id: id, approved: true }),
    reviewService.getAverageRating(id)
  ])

  return res.json({
    reviews,
    count,
    average_rating: average || 0,
    limit,
    offset,
  })
}
```

2. **Create Product Review**:
```typescript
// src/api/routes/store/products/create-product-review.ts
export default async (req, res) => {
  const { id } = req.params
  const {
    title,
    content,
    rating,
    customer_id,
    first_name,
    last_name,
    email,
  } = req.body

  const reviewService = req.scope.resolve("productReviewService")
  
  const review = await reviewService.create({
    title,
    content,
    rating,
    product_id: id,
    customer_id,
    first_name,
    last_name,
    email,
  })

  return res.status(201).json({ review })
}
```

### Review Moderation

Implement admin endpoints for review moderation:

```typescript
// src/api/routes/admin/product-reviews/update-product-review.ts
export default async (req, res) => {
  const { id } = req.params
  const { approved } = req.body

  const reviewService = req.scope.resolve("productReviewService")
  
  const review = await reviewService.update(id, { approved })

  return res.json({ review })
}
```

## Frontend Implementation

### Review Display Component

Create a component to display individual reviews:

```tsx
// src/modules/products/components/product-reviews/review.tsx
function Review({ review }: { review: StoreProductReview }) {
  return (
    <div className="flex flex-col gap-y-2 text-base-regular text-ui-fg-base">
      <div className="flex gap-x-2 items-center">
        {review.title && <strong>{review.title}</strong>}
        <div className="flex gap-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              {index <= review.rating ? (
                <StarSolid className="text-ui-tag-orange-icon" />
              ) : (
                <Star />
              )}
            </span>
          ))}
        </div>
      </div>
      <div>{review.content}</div>
      <div className="border-t border-ui-border-base pt-4 text-sm-regular">
        {review.first_name} {review.last_name}
      </div>
    </div>
  )
}
```

### Review Form Component

Create a form for submitting reviews:

```tsx
// src/modules/products/components/product-reviews/form.tsx
export default function ProductReviewsForm({
  productId,
}: ProductReviewsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<{
    title: string
    content: string
    rating: number
    first_name: string
    last_name: string
    email: string
  }>({
    title: "",
    content: "",
    rating: 5,
    first_name: "",
    last_name: "",
    email: "",
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await axios.post(
        `/store/products/${productId}/reviews`,
        formState
      )
      
      // Reset form and show success message
      setFormState({
        title: "",
        content: "",
        rating: 5,
        first_name: "",
        last_name: "",
        email: "",
      })
      alert("Review submitted successfully! It will be visible after approval.")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("There was an error submitting your review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl-semi mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="grid grid-cols-1 gap-y-4">
          <div>
            <label htmlFor="rating" className="block text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex gap-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormState({ ...formState, rating: index + 1 })}
                >
                  {index < formState.rating ? (
                    <StarSolid className="text-ui-tag-orange-icon" />
                  ) : (
                    <Star />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-gray-700 mb-1">
              Review
            </label>
            <textarea
              id="content"
              className="w-full p-2 border border-gray-300 rounded h-24"
              value={formState.content}
              onChange={(e) => setFormState({ ...formState, content: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <label htmlFor="first_name" className="block text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formState.first_name}
                onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formState.last_name}
                onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  )
}
```

### Rating Display

Create a component to display the average rating:

```tsx
// src/modules/products/components/product-reviews/rating-display.tsx
export default function RatingDisplay({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <span className="text-base-regular text-gray-600 mb-2">
        Customer Reviews
      </span>
      <div className="flex gap-x-2 justify-center items-center">
        <div className="flex gap-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              {!rating || index >= rating ? (
                <Star />
              ) : (
                <StarSolid className="text-gold-primary" />
              )}
            </span>
          ))}
        </div>
        <span className="text-base-regular text-gray-600">
          ({count} reviews)
        </span>
      </div>
    </div>
  )
}
```

## Integration with Product Pages

Add the review components to the product detail page:

```tsx
// src/modules/products/templates/index.tsx
import ProductReviews from "../components/product-reviews"

export default function ProductTemplate({ product }) {
  // Existing product template code
  
  return (
    <div>
      {/* Product details section */}
      
      {/* Add reviews section */}
      <div className="w-full">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  )
}
```

Create a data fetching utility:

```typescript
// src/lib/data/products.ts
export async function getProductReviews({
  productId,
  limit = 10,
  offset = 0,
}) {
  const { data } = await medusaClient.client.request(
    "GET",
    `/store/products/${productId}/reviews`,
    {
      params: {
        limit,
        offset,
      },
    }
  )
  
  return data
}
```

## Testing the Review System

To test the review system:

1. **As an Admin**:
   - Access the admin dashboard
   - Navigate to the Products section
   - Select a product and check the Reviews tab
   - Approve or reject submitted reviews

2. **As a Customer**:
   - Visit a product page
   - Scroll down to the reviews section
   - Submit a review using the review form
   - After admin approval, verify that your review appears on the product page

3. **Quality Tests**:
   - Verify that the average rating is calculated correctly
   - Check that reviews are paginated properly
   - Ensure that only approved reviews are visible
   - Test the review form validation

---

This implementation guide provides the foundation for a robust product review system in your Pisces Top storefront. You can further enhance this system by adding features like review filtering, sorting, and even allowing customers to upload images with their reviews. 