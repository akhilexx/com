import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { User, ShoppingBag } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto bg-white/70 backdrop-blur-md border-b border-ui-border-base/20 shadow-sm transition-all duration-200">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-pisces-light/50 transition-colors duration-200">
                <SideMenu regions={regions} />
              </div>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus font-bold uppercase relative text-pisces-primary hover:text-pisces-accent transition-colors duration-300 sparkle-effect"
              data-testid="nav-store-link"
            >
              <span className="relative z-10">Pisces Top</span>
              <span className="absolute inset-0 bg-sparkle-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-3 h-full flex-1 basis-0 justify-end">
            <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-pisces-light/50 transition-colors duration-200">
              <LocalizedClientLink
                className="text-ui-fg-subtle hover:text-pisces-primary transition-colors duration-200"
                href="/account"
                data-testid="nav-account-link"
                aria-label="Account"
              >
                <User />
              </LocalizedClientLink>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-pisces-light/50 transition-colors duration-200">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="text-ui-fg-subtle hover:text-pisces-primary transition-colors duration-200"
                    href="/cart"
                    data-testid="nav-cart-link"
                    aria-label="Cart"
                  >
                    <ShoppingBag />
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
