import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="card-hover bg-white rounded-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pisces-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4">
          <div className="flex txt-compact-medium justify-between items-center mb-1">
            <Text className="text-pisces-dark font-medium group-hover:text-pisces-accent transition-colors duration-300" data-testid="product-title">
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2">
              {cheapestPrice && (
                <div className="sparkle-effect">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              )}
            </div>
          </div>
          {product.description && (
            <Text className="text-ui-fg-subtle text-sm line-clamp-2 mt-1 h-10">
              {product.description}
            </Text>
          )}
          <div className="mt-3 w-0 group-hover:w-full h-0.5 bg-pisces-secondary transition-all duration-500"></div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
