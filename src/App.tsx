import { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/homepage';
import ProductListing from './pages/productlisting';
import ProductDetails from './pages/productdetails';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Authentication from './pages/Authentication';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Layout component for routes that need Navbar + Footer
function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Navbar 
        isScrolled={isScrolled} 
        setIsScrolled={setIsScrolled} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth page — no Navbar/Footer */}
          <Route path="/auth" element={<Authentication />} />
          
          {/* All other pages — wrapped with Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
