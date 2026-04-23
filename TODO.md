# Navigation Implementation Plan for Lumi-Baby

## Plan Overview
- Update Navbar logo link to navigate to Home (/)
- Update Homepage "Shop Now" button to navigate to /products  
- Update Homepage product cards (BestSellers) to navigate to /products

## Steps to Complete (0/3)

### [x] Step 1: Update src/components/Navbar.tsx
Replace logo `<a href="#">` with `<Link to="/">` ✅

### [x] Step 2: Update src/pages/homepage.tsx  
- Add `useNavigate` import and hook
- Add onClick to Shop Now button  
- Add onClick to BestSellers product card wrappers ✅

### [ ] Step 3: Test navigation & complete
- Verify logo → home
- Verify Shop Now → /products  
- Verify product cards → /products
- Mark all steps complete
