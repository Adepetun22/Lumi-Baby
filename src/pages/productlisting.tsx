import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/Product/FilterSidebar';
import { useCart } from '../contexts/CartContext';
import { ALL_PRODUCTS, type Product } from '../data/products';

// ==================== TYPES ====================

interface FilterState {
  category: string;
  maxPrice: number;
  ages: Set<string>;
  brands: string[];
  ratings: number[];
}

// ==================== FILTER DATA ====================

// ==================== FILTER DATA ====================

const CATEGORIES = [
  { name: 'All', label: 'All Products', count: 986 },
  { name: 'Feeding', label: '🍼 Feeding', count: 124 },
  { name: 'Diapering', label: '🌿 Diapering', count: 87 },
  { name: 'Nursery', label: '🌙 Nursery', count: 210 },
  { name: 'Toys', label: '🧸 Toys', count: 195 },
  { name: 'Clothing', label: '👶 Clothing', count: 302 },
  { name: 'Gifts', label: '🎁 Gifts', count: 68 },
];

const BRANDS = [
  { id: 'b1', name: 'Lumi Originals', count: 312, checked: false },
  { id: 'b2', name: 'NatureBorn', count: 187, checked: false },
  { id: 'b3', name: 'TinyLeaf', count: 143, checked: false },
  { id: 'b4', name: 'Dreamland', count: 98, checked: false },
  { id: 'b5', name: 'SoftCloud', count: 76, checked: false },
];

const AGE_GROUPS = ['Newborn', '0–3 mo', '3–6 mo', '6–12 mo', '1–2 yr', '2–3 yr', '3+ yr'];

const RATINGS = [
  { id: 'r5', label: '★★★★★ 5 stars', value: 5, checked: false },
  { id: 'r4', label: '★★★★☆ 4+ stars', value: 4, checked: false },
  { id: 'r3', label: '★★★☆☆ 3+ stars', value: 3, checked: false },
];

// ==================== CUSTOM HOOKS ====================

// Custom Cursor Hook
function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .cat-pill, .product-card, .age-tag, .variant-pill, .filter-chip button')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursor.style.background = '#8FAF8A';
        follower.style.opacity = '0.2';
      }
    };

    const handleMouseOut = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = '#C97B5A';
      follower.style.opacity = '0.45';
    };

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return { cursorRef, followerRef };
}

// ==================== HELPER FUNCTIONS ====================



// ==================== COMPONENTS ====================

import ProductMainCard from '../components/Product/ProductMainCard';
import QuickViewModal from '../components/Product/QuickViewModal';


// Mobile Filter Sheet
function MobileFilterSheet({ 
  isOpen, 
  onClose,
  onApply,
  filters,
  setFilters,
  onClearAll
}: { 
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
}) {
  // Note: Collapsible sections functionality can be added if needed

  // Category handlers
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  // Price handlers
  const handlePriceChange = (value: number) => {
    setFilters(prev => ({ ...prev, maxPrice: value }));
  };

  // Brand handlers
  const handleBrandChange = (brandName: string, checked: boolean) => {
    setFilters(prev => {
      const newBrands = checked 
        ? [...prev.brands, brandName]
        : prev.brands.filter(b => b !== brandName);
      return { ...prev, brands: newBrands };
    });
  };

  // Age group handlers
  const handleAgeToggle = (age: string) => {
    setFilters(prev => {
      const newAges = new Set(prev.ages);
      if (newAges.has(age)) {
        newAges.delete(age);
      } else {
        newAges.add(age);
      }
      return { ...prev, ages: newAges };
    });
  };

  // Rating handlers
  const handleRatingChange = (ratingValue: number, checked: boolean) => {
    setFilters(prev => {
      const newRatings = checked 
        ? [...prev.ratings, ratingValue]
        : prev.ratings.filter(r => r !== ratingValue);
      return { ...prev, ratings: newRatings };
    });
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[900] bg-charcoal/45 backdrop-blur-[4px] transition-opacity duration-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[901] bg-warm-white rounded-[24px_24px_0_0] max-h-[85vh] overflow-y-auto transition-transform duration-40 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-10 h-1 bg-clay/14 rounded-[4px] mx-auto mt-4 mb-6" />
        <div className="flex items-center justify-between mb-5 px-6">
          <h3 className="font-display text-[24px] font-normal">Filters</h3>
          <button 
            className="w-9 h-9 rounded-full border-none bg-clay-light cursor-pointer text-[16px] flex items-center justify-center"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {/* Full filter content - same as desktop sidebar */}
        <div className="px-6 pb-6">
          {/* Category Section */}
          <div className="mb-9">
            <div className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between">
              Category
              <span className="text-muted text-[16px]">↓</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className={`cat-pill flex items-center justify-between px-3.5 py-2.5 rounded-[10px] cursor-pointer text-[13px] transition-all border border-transparent ${
                    filters.category === cat.name 
                      ? 'bg-clay text-white border-clay' 
                      : 'text-muted hover:bg-clay-light hover:text-clay'
                  }`}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  <span>{cat.label}</span>
                  <span className="text-[11px] opacity-70">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="mb-9">
            <div className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between">
              Price Range
              <span className="text-muted text-[16px]">↓</span>
            </div>
            <div className="flex justify-between text-[13px] text-clay font-medium mb-3.5">
              <span>$0</span>
              <span>${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full accent-clay cursor-pointer"
            />
          </div>

          {/* Brand Section */}
          <div className="mb-9">
            <div className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between">
              Brand
              <span className="text-muted text-[16px]">↓</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {BRANDS.map((brand) => (
                <div key={brand.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`mobile-${brand.id}`}
                    checked={filters.brands.includes(brand.name) || (brand.checked && filters.brands.length === 0)}
                    onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                    className="w-4 h-4 accent-clay cursor-pointer rounded"
                  />
                  <label htmlFor={`mobile-${brand.id}`} className="text-[13px] text-muted cursor-pointer flex-1 hover:text-charcoal transition-colors">
                    {brand.name}
                  </label>
                  <span className="text-[11px] text-muted">{brand.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age Group Section */}
          <div className="mb-9">
            <div className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between">
              Age Group
              <span className="text-muted text-[16px]">↓</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((age) => (
                <div
                  key={age}
                  className={`age-tag px-3.5 py-1.5 rounded-[20px] text-[12px] border border-clay/14 cursor-pointer transition-all whitespace-nowrap ${
                    filters.ages.has(age) 
                      ? 'bg-clay border-clay text-white' 
                      : 'text-muted hover:border-clay hover:text-clay'
                  }`}
                  onClick={() => handleAgeToggle(age)}
                >
                  {age}
                </div>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-9">
            <div className="text-[11px] tracking-[0.22em] uppercase text-charcoal font-medium mb-[18px] flex items-center justify-between">
              Rating
              <span className="text-muted text-[16px]">↓</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {RATINGS.map((rating) => (
                <div key={rating.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`mobile-${rating.id}`}
                    checked={filters.ratings.includes(rating.value) || (rating.checked && filters.ratings.length === 0)}
                    onChange={(e) => handleRatingChange(rating.value, e.target.checked)}
                    className="w-4 h-4 accent-clay cursor-pointer rounded"
                  />
                  <label htmlFor={`mobile-${rating.id}`} className="text-[13px] text-muted cursor-pointer">
                    {rating.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          <button 
            onClick={onClearAll}
            className="w-full py-[11px] border border-clay/14 rounded-[10px] bg-transparent text-muted text-[12px] tracking-[0.08em] uppercase cursor-pointer transition-all hover:border-clay hover:text-clay hover:bg-clay-light mt-1"
          >
            ✕ Clear All Filters
          </button>
        </div>

        <div className="px-6 pb-6">
          <button 
            className="w-full max-w-[416px] mx-auto block py-[15px] rounded-[50px] border-none bg-clay text-white font-body text-[13px] tracking-[0.1em] uppercase cursor-pointer font-medium mt-5"
            onClick={onApply}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// Active Filter Chips
function ActiveFilters({ 
  filters, 
  searchQuery,
  onRemoveCategory,
  onRemovePrice,
  onRemoveAge,
  onRemoveBrand,
  onRemoveRating,
  onRemoveSearch
}: { 
  filters: FilterState;
  searchQuery: string;
  onRemoveCategory: () => void;
  onRemovePrice: () => void;
  onRemoveAge: (age: string) => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveRating: (rating: number) => void;
  onRemoveSearch: () => void;
}) {
  const hasFilters = filters.category !== 'All' || filters.maxPrice < 200 || filters.ages.size > 0 || filters.brands.length > 0 || filters.ratings.length > 0 || searchQuery.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {searchQuery.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-clay/20 border border-clay/30 rounded-full text-[12px] text-clay font-medium">
          Search: "{searchQuery}"
          <button onClick={onRemoveSearch} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      )}
      {filters.category !== 'All' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {filters.category}
          <button onClick={onRemoveCategory} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      )}
      {filters.maxPrice < 200 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          Under ${filters.maxPrice}
          <button onClick={onRemovePrice} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      )}
      {Array.from(filters.ages).map(age => (
        <div key={age} className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {age}
          <button onClick={() => onRemoveAge(age)} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      ))}
      {filters.brands.map(brand => (
        <div key={brand} className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {brand}
          <button onClick={() => onRemoveBrand(brand)} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      ))}
      {filters.ratings.map(rating => (
        <div key={rating} className="flex items-center gap-1.5 px-3 py-1.5 bg-clay-light border border-clay/20 rounded-full text-[12px] text-clay font-medium">
          {rating}+ stars
          <button onClick={() => onRemoveRating(rating)} className="bg-none border-none cursor-pointer text-clay text-[14px] leading-none hover:scale-120 transition-transform">✕</button>
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-20 px-10 col-span-full">
      <div className="text-[64px] mb-5">🔍</div>
      <h3 className="font-display text-[28px] font-normal mb-2.5">
        {searchQuery ? `No results for "${searchQuery}"` : 'No products found'}
      </h3>
      <p className="text-muted text-[14px]">
        {searchQuery ? 'Try a different search term or adjust your filters' : 'Try adjusting your filters'}
      </p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ProductListing() {
  const { cursorRef, followerRef } = useCustomCursor();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    maxPrice: 200,
    ages: new Set(['0–3 mo']),
    brands: [],
    ratings: [],
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { increment } = useCart();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  // Filter and sort products
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (filters.category !== 'All' && product.cat !== filters.category) return false;
    if (product.price > filters.maxPrice) return false;
    if (filters.ages.size > 0 && !filters.ages.has(product.age)) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
    if (filters.ratings.length > 0 && !filters.ratings.some(r => product.rating >= r)) return false;
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const matches = product.name.toLowerCase().includes(term) ||
        product.desc.toLowerCase().includes(term) ||
        product.cat.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.age.toLowerCase().includes(term);
      if (!matches) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const displayedProducts = filteredProducts.slice(0, displayedCount);

  // Handlers
  const handleWishlistToggle = (_id: number) => {
    // Handle wishlist toggle logic
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'All',
      maxPrice: 200,
      ages: new Set(['0–3 mo']),
      brands: [],
      ratings: [],
    });
    if (searchQuery) {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || allLoaded) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 200;
      
      if (scrollPosition >= threshold) {
        setIsLoading(true);
        setTimeout(() => {
          setDisplayedCount(prev => {
            const newCount = prev + 12;
            if (newCount >= filteredProducts.length) {
              setAllLoaded(true);
            }
            return newCount;
          });
          setIsLoading(false);
        }, 900);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, allLoaded, filteredProducts.length]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(12);
    setAllLoaded(false);
  }, [filters, sortBy, searchQuery]);

  return (
    <>
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed w-2.5 h-2.5 bg-clay rounded-full pointer-events-none z-[9999] mix-blend-multiply transition-transform duration-120"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={followerRef} 
        className="fixed w-8.5 h-8.5 border border-clay rounded-full pointer-events-none z-[9998] opacity-45 transition-transform duration-220 ease-out"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        increment={increment}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet 
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        onApply={() => setIsMobileSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onClearAll={handleClearFilters}
      />

      <div className="flex min-h-screen pt-[72px]">
        {/* Sidebar - Visible on desktop (lg = 1024px+) */}
        <div className="hidden lg:block xl:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClearAll={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-7 pb-20 lg:p-7">
          {/* Toolbar - Visible only on mobile, hidden on desktop */}
          <div className="lg:hidden flex items-center justify-between mb-7 pb-[22px] border-b border-clay/14 flex-wrap gap-3.5">
            <div className="toolbar-left">
              <h1 className="font-display text-[34px] font-light tracking-tight leading-[1.1]">
                {searchQuery ? (
                  <>Search <em className="italic text-clay">"{searchQuery}"</em></>
                ) : (
                  <>All <em className="italic text-clay">Products</em></>
                )}
              </h1>
              <p className="text-[13px] text-muted mt-1">
                Showing {Math.min(displayedCount, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Mobile Filter Button - shown on mobile/tablet, hidden on desktop */}
              <button 
                className="flex items-center gap-2 px-[18px] py-2.5 rounded-[10px] border border-clay/14 bg-warm-white font-body text-[13px] text-charcoal cursor-pointer transition-all hover:border-clay hover:text-clay lg:!hidden"
                onClick={() => setIsMobileSheetOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                Filters
              </button>

              {/* Sort Select */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-3.5 py-2.25 pr-9 rounded-[10px] border border-clay/14 bg-warm-white font-body text-[13px] text-charcoal cursor-pointer outline-none transition-colors hover:border-clay focus:border-clay"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted pointer-events-none">↕</span>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1">
                <button 
                  className={`w-8.5 h-8.5 rounded-[8px] border border-clay/14 bg-transparent cursor-pointer flex items-center justify-center text-muted transition-all ${viewMode === 'grid' ? 'border-clay text-clay bg-clay-light' : 'hover:border-clay hover:text-clay'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button 
                  className={`w-8.5 h-8.5 rounded-[8px] border border-clay/14 bg-transparent cursor-pointer flex items-center justify-center text-muted transition-all ${viewMode === 'list' ? 'border-clay text-clay bg-clay-light' : 'hover:border-clay hover:text-clay'}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                    <circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters 
            filters={filters}
            searchQuery={searchQuery}
            onRemoveCategory={() => setFilters(prev => ({ ...prev, category: 'All' }))}
            onRemovePrice={() => setFilters(prev => ({ ...prev, maxPrice: 200 }))}
            onRemoveAge={(age) => {
              const newAges = new Set(filters.ages);
              newAges.delete(age);
              setFilters(prev => ({ ...prev, ages: newAges }));
            }}
            onRemoveBrand={(brand) => setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }))}
            onRemoveRating={(rating) => setFilters(prev => ({ ...prev, ratings: prev.ratings.filter(r => r !== rating) }))}
            onRemoveSearch={handleClearSearch}
          />

          {/* Product Grid */}
          <div 
            className={`grid gap-5.5 transition-all duration-300 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} ${viewMode === 'list' ? 'list-view' : ''}`}
          >
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${(index % 12) * 40}ms` }}
                  className="animate-[cardIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
                >
                <ProductMainCard 
                    product={product}
                    viewMode={viewMode}
                    onWishlistToggle={handleWishlistToggle}
                    onQuickView={handleQuickView}
                  />

                </div>
              ))
            ) : (
              <EmptyState searchQuery={searchQuery} />
            )}
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="h-[60px] flex items-center justify-center mt-5">
              <div className="w-9 h-9 border-3 border-clay-light border-t-clay rounded-full animate-spin" />
            </div>
          )}

          {/* All Loaded Message */}
          {allLoaded && displayedProducts.length > 0 && (
            <div className="text-center py-8 text-muted text-[13px] tracking-[0.1em] uppercase">
              ✦ You've seen everything ✦
            </div>
          )}
        </main>
      </div>
    </>
  );
}

