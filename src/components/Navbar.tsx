import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isScrolled: boolean;
  setIsScrolled: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

// Nav Item with Mega Menu
function NavItem({ label, isScrolled, children }: { label: string; isScrolled: boolean; children?: React.ReactNode }) {
  const textColor = isScrolled ? 'text-black' : 'text-black';

  return (
    <div className="nav-item">
      <div className={`relative text-xs tracking-widest uppercase cursor-pointer py-2 transition-colors duration-300 font-medium ${textColor} hover:text-clay`}>
        {label}
      </div>
      {children && (
        <div className="mega-menu">
          {children}
        </div>
      )}
    </div>
  );
}

// Mega Menu Content
function MegaMenu({ type = 'feeding' }: { type?: 'feeding' | 'diapering' | 'nursery' }) {
  const content = {
    feeding: [
      { title: 'Breast Feeding', items: ['Breast Pumps', 'Nursing Pads', 'Nipple Cream', 'Nursing Bras'] },
      { title: 'Bottle Feeding', items: ['Baby Bottles', 'Formula Dispensers', 'Bottle Warmers', 'Sterilizers'] },
      { title: 'Solid Foods', items: ['High Chairs', 'Baby Food Makers', 'Bibs & Burp Cloths', 'Suction Bowls'] },
    ],
    diapering: [
      { title: 'Diapers', items: ['Disposable Diapers', 'Cloth Diapers', 'Swim Diapers'] },
      { title: 'Changing', items: ['Changing Tables', 'Changing Pads', 'Diaper Bags'] },
      { title: 'Wipes & Creams', items: ['Baby Wipes', 'Diaper Cream', 'Powder'] },
    ],
    nursery: [
      { title: 'Sleep', items: ['Cribs & Bassinets', 'Baby Monitors', 'Sleep Sacks'] },
      { title: 'Décor', items: ['Wall Art', 'Mobiles', 'Night Lights'] },
      { title: 'Storage', items: ['Dressers', 'Toy Boxes', 'Closet Organizers'] },
    ],
  };

  return (
    <>
      {content[type].map((col, i) => (
        <div key={i} className="mega-col">
          <h4 className="font-display text-lg font-medium text-clay mb-3.5 border-b border-clay/20 pb-2">{col.title}</h4>
          {col.items.map((item, j) => (
            <a key={j} href="#" className="block text-sm text-muted no-underline py-1 transition-all duration-200 hover:text-clay hover:pl-1.5">{item}</a>
          ))}
        </div>
      ))}
    </>
  );
}

// Mobile Nav Item with optional accordion mega menu
function MobileNavItem({ label, megaType, onClose }: { label: string; megaType?: 'feeding' | 'diapering' | 'nursery'; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  const content = {
    feeding: [
      { title: 'Breast Feeding', items: ['Breast Pumps', 'Nursing Pads', 'Nipple Cream', 'Nursing Bras'] },
      { title: 'Bottle Feeding', items: ['Baby Bottles', 'Formula Dispensers', 'Bottle Warmers', 'Sterilizers'] },
      { title: 'Solid Foods', items: ['High Chairs', 'Baby Food Makers', 'Bibs & Burp Cloths', 'Suction Bowls'] },
    ],
    diapering: [
      { title: 'Diapers', items: ['Disposable Diapers', 'Cloth Diapers', 'Swim Diapers'] },
      { title: 'Changing', items: ['Changing Tables', 'Changing Pads', 'Diaper Bags'] },
      { title: 'Wipes & Creams', items: ['Baby Wipes', 'Diaper Cream', 'Powder'] },
    ],
    nursery: [
      { title: 'Sleep', items: ['Cribs & Bassinets', 'Baby Monitors', 'Sleep Sacks'] },
      { title: 'Décor', items: ['Wall Art', 'Mobiles', 'Night Lights'] },
      { title: 'Storage', items: ['Dressers', 'Toy Boxes', 'Closet Organizers'] },
    ],
  };

  if (!megaType) {
    return (
      <a
        href="#"
        onClick={onClose}
        className={`block font-display text-3xl font-light no-underline py-3 border-b border-charcoal/5 transition-colors duration-200 cursor-pointer ${open ? 'text-clay pl-2' : 'text-charcoal'}`}
      >{label}</a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`mobile-nav-btn w-full flex items-center justify-between font-display text-3xl font-light no-underline py-3 border-b border-charcoal/5 transition-colors duration-200 cursor-pointer ${open ? 'text-clay pl-2' : 'text-charcoal'}`}
      >
        {label}
        <span className={`text-clay text-2xl transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? 'max-h-[600px] pb-4' : 'max-h-0'}`}>
        {content[megaType].map((col, i) => (
          <div key={i} className="mb-4">
            <h4 className="font-display text-base font-medium text-clay mb-2 border-b border-clay/20 pb-1">{col.title}</h4>
            {col.items.map((item, j) => (
              <a key={j} href="#" className="block text-sm text-muted no-underline py-1 transition-all duration-200 hover:text-clay hover:pl-1.5">{item}</a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { totalCount } = useCart();
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <div className={`fixed inset-0 z-[999] bg-warm-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-9 py-[90px] overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Mobile Search Input */}
      <div className="mobile-search mb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-clay/10 border border-clay/20">
          <svg className="w-5 h-5 text-clay" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            placeholder="Search products…" 
            className="bg-transparent border-none outline-none font-body text-base w-full text-charcoal placeholder-muted"
          />
        </div>
      </div>
      
      <MobileNavItem label="Feeding" megaType="feeding" onClose={onClose} />
      <MobileNavItem label="Diapering" megaType="diapering" onClose={onClose} />
      <MobileNavItem label="Nursery" megaType="nursery" onClose={onClose} />
      <MobileNavItem label="Toys" onClose={onClose} />
      <MobileNavItem label="Clothing" onClose={onClose} />
      <MobileNavItem label="Gifts" onClose={onClose} />
      <div className="mt-8 flex flex-col gap-3">
        {auth.isAuthenticated ? (
          <>
            <Link to="/auth" onClick={onClose} className="font-display text-lg text-charcoal no-underline py-2 border-none">My Account</Link>
            <Link to="#" onClick={onClose} className="font-display text-lg text-charcoal no-underline py-2 border-none">Wishlist</Link>
            <button
              className="font-display text-lg text-charcoal no-underline py-2 border-none text-left bg-transparent cursor-pointer"
              onClick={() => {
                auth.logout();
                onClose();
                void navigate('/');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/auth" onClick={onClose} className="font-display text-lg text-charcoal no-underline py-2 border-none">Log in</Link>
        )}
        <Link to="/cart" onClick={onClose} className="font-display text-lg text-charcoal no-underline py-2 border-none">Cart ({totalCount})</Link>
      </div>
    </div>
  );
}

// Main Navbar Component
export default function Navbar({ isScrolled, setIsScrolled, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  const { uniqueCount } = useCart();
  const auth = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navBg = isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent';
  const textColor = isScrolled ? 'text-black' : 'text-black';
  const accentColor = isScrolled ? 'text-clay' : 'text-blush';
  const searchBg = isScrolled ? 'bg-clay/10 border-clay/20' : 'bg-white/15 border-white/30';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] px-12 h-[72px] flex items-center justify-between transition-all duration-300 ${navBg} ${isScrolled ? 'scrolled' : ''}`}>
<Link to="/" className={`font-display text-2xl font-light tracking-widest transition-colors duration-300 flex items-center gap-2 ${textColor}`}>
  Lumi<span className={accentColor}>✦</span>Baby
</Link>

        {/* Desktop Navigation */}
        <div className="nav-center">
          <NavItem label="Feeding" isScrolled={isScrolled}>
            <MegaMenu />
          </NavItem>
          <NavItem label="Diapering" isScrolled={isScrolled}>
            <MegaMenu type="diapering" />
          </NavItem>
          <NavItem label="Nursery" isScrolled={isScrolled}>
            <MegaMenu type="nursery" />
          </NavItem>
          <NavItem label="Toys" isScrolled={isScrolled} />
          <NavItem label="Clothing" isScrolled={isScrolled} />
          <NavItem label="Gifts" isScrolled={isScrolled} />
        </div>

        {/* Nav Icons */}
        <div className="nav-icons">
          {/* Search Bar */}
          <div className={`search-bar items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${searchBg}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input 
              type="text" 
              placeholder="Search products…" 
              className="bg-transparent border-none outline-none font-body text-sm w-36 tracking-wide placeholder-white/60"
              style={{ color: isScrolled ? '#2C2C2C' : 'white' }}
            />
          </div>

          {/* User Icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button className="nav-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {auth.isAuthenticated ? (
                <div className="w-[22px] h-[22px] rounded-full bg-clay text-white flex items-center justify-center text-[11px] font-medium">
                  {auth.user?.initial}
                </div>
              ) : (
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {/* User Dropdown */}
            <div className={`user-dropdown ${dropdownOpen ? 'show' : ''}`}>
              {auth.isAuthenticated ? (
                <>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{auth.user?.initial}</div>
                    <div className="dropdown-name">{auth.user?.name}</div>
                    <div className="dropdown-email">{auth.user?.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/auth" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    <span>User Profile</span>
                  </Link>
                  <Link to="#" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">♡</span>
                    <span>Wishlist</span>
                  </Link>
                  <button
                    className="dropdown-item w-full text-left"
                    onClick={() => {
                      auth.logout();
                      setDropdownOpen(false);
                      void navigate('/');
                    }}
                  >
                    <span className="dropdown-icon">↪</span>
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    <span>Log in</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="nav-icon relative">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {uniqueCount > 0 && <span className="cart-badge">{uniqueCount}</span>}
          </Link>

          {/* Hamburger */}
          <button 
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (rendered outside nav for proper positioning) */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

// Export MobileMenu separately for cases where it's needed independently
export { MobileMenu };

