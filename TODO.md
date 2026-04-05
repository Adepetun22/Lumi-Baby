# Cart Integration TODO

## [x] 1. Create CartContext (src/contexts/CartContext.tsx)
- Shared cartCounts, totalCount, add/increment/decrement funcs
- localStorage persistence

## [x] 2. Wrap App with CartProvider (src/App.tsx)

## [x] 3. Update Navbar (src/components/Navbar.tsx)
- Use CartContext for dynamic badge/mobile count

## [x] 4. Update ProductListing (src/pages/productlisting.tsx)
- Replace local cart state with Context
- Update handlers to context funcs
- Pass context to ProductMainCard/QuickViewModal

## [ ] 5. Update ProductMainCard (src/components/Product/ProductMainCard.tsx)
- Use context qty/onQtyChange

## [x] 6. Test: /products → add qty via +/- → Nav badge updates
## [ ] 7. Enhance: ProductCard.tsx (+ button → QuickView + Add)

