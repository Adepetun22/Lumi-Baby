import { useState } from 'react';

interface ProductCardProps {
  badge?: string;
  badgeType?: 'bestseller' | 'new' | 'toprated';
  bgColor: string;
  icon: string;
  name: string;
  sub: string;
  price: string;
  rating: number;
  reviews: number;
  delay: number;
  className?: string;
}

export default function ProductCard({ 
  badge, 
  badgeType = 'bestseller', 
  bgColor, 
  icon, 
  name, 
  sub, 
  price, 
  rating, 
  reviews, 
  delay, 
  className = '' 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const badgeBg = badgeType === 'new' ? 'bg-sage-dark' : 'bg-clay';

  return (
    <div className={`reveal reveal-delay-${delay} group ${className}`}>
      <div className="rounded-[20px] overflow-hidden cursor-pointer bg-warm-white transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-charcoal/10">
        <div className="relative aspect-square overflow-hidden flex items-center justify-center">
          <div className={`w-full h-full flex items-center justify-center text-[72px] transition-transform duration-500 ease-out group-hover:scale-108 bg-gradient-to-br ${bgColor}`}>
            {icon}
          </div>
          {badge && (
            <span className={`absolute top-3.5 left-3.5 text-xs tracking-widest uppercase px-3 py-1 rounded-full font-medium z-10 ${badgeBg} text-white`}>
              {badge}
            </span>
          )}
          <button
            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-115 hover:bg-white"
            onClick={toggleWishlist}
            style={{ color: isWishlisted ? '#C97B5A' : 'inherit' }}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
        </div>
        <div className="p-5 pb-6">
          <h3 className="font-display text-xl font-normal text-charcoal mb-1.5 leading-tight">{name}</h3>
          <p className="text-xs text-muted mb-3.5">{sub}</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex gap-0.5 items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-xs ${i < rating ? 'text-gold' : 'text-gray-300'}`}>★</span>
                ))}
                <span className="text-xs text-muted ml-1">({reviews.toLocaleString()})</span>
              </div>
              <div className="text-lg font-medium text-clay mt-1">{price}</div>
            </div>
            <button
              className="w-9 h-9 rounded-full border-none cursor-pointer text-white text-lg font-light flex items-center justify-center transition-all duration-300 hover:bg-[#b56a49] hover:scale-110"
              onClick={handleAddToCart}
              style={{ backgroundColor: isAdded ? '#5C7A57' : '#C97B5A' }}
            >
              {isAdded ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

