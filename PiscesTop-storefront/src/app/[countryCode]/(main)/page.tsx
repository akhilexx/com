import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import Link from "next/link"
import { Button } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Pisces Top | Premium Clothing and Accessories",
  description:
    "Discover the latest collection of premium clothing and accessories at Pisces Top. Shop with cryptocurrency.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  
  // Get products for new arrivals section
  const { response: { products } } = await listProducts({
    regionId: region?.id,
    queryParams: {
      limit: 8,
    },
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12 bg-gradient-to-b from-white to-pisces-light/20">
        <div className="content-container my-10">
          <h2 className="text-3xl font-bold text-pisces-primary mb-4">Featured Collections</h2>
          <div className="w-20 h-1 bg-pisces-secondary mb-10"></div>
        </div>
        <ul className="flex flex-col gap-y-8">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
        
        {products && products.length > 0 && (
          <div className="content-container mt-16 mb-10">
            <h2 className="text-3xl font-bold text-pisces-primary mb-4">New Arrivals</h2>
            <div className="w-20 h-1 bg-pisces-secondary mb-10"></div>
            <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-x-6 gap-y-8">
              {products.slice(0, 4).map((product) => (
                <Link href={`/products/${product.handle}`} key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${products.indexOf(product) * 0.1}s` }}>
                  <div className="card-hover bg-white rounded-lg border border-gray-100 overflow-hidden h-full">
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={product.thumbnail || "/placeholder-image.png"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-pisces-dark group-hover:text-pisces-primary transition-colors duration-200">{product.title}</h3>
                      <div className="mt-2 text-pisces-primary font-semibold sparkle-effect">
                        Shop Now →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/store">
                <Button className="btn-primary">View All Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

