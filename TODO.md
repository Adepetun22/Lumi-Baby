# Checkout Conversion TODO

## Plan Breakdown (Step 2: Stepper + nav removal)

**✅ Completed Analysis/Planning**
- [x] Analyzed checkout.html, Stepper.tsx, App.tsx, CartContext, products.ts, CSS
- [x] User approved plan

**⏳ Pending Implementation Steps**
1. **Create `src/pages/checkout.tsx`** ✅
   - React hooks for state (currentStep, forms, validation)
   - Cart integration via useCart() + ALL_PRODUCTS
   - Replace steps-bar with `<Stepper steps={['Information','Shipping','Payment','Review']} currentStep={currentStep-1} />`
   - Remove nav section (use global Navbar)
   - Port HTML/JS/CSS to JSX/Tailwind
   - Custom cursor/toast/confetti/loading preserved

2. **Update `src/App.tsx`** ✅ - Added import + Route

3. **Test integration**
   - Run `npm run dev`
   - Verify /checkout loads with Stepper (no old steps-bar), no duplicate nav
   - Cart displays real items, forms/steps work
   - Responsive + animations intact

4. **Optional polish**
   - Add checkout Link from cart.tsx
   - CSS tweaks if needed (create src/styles/checkout.css)

**🚀 Completion**
- [ ] Mark all steps done
- [ ] `attempt_completion`

**Progress: 0/4 steps complete**

