import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  cat: string;
  desc: string;
  emoji: string;
  bg: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeType: 'sale' | 'new' | 'hot' | null;
  variants: string[];
  age: string;
  brand: string;
}

interface ProductMainCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onWishlistToggle: (id: number) => void;
  onQuickView: (product: Product) => void;
}

const getBgGradient = (bg: string): string => {
  const gradients: Record<string, string> = {
    'img-bg-1': 'from-[#FDE8E0] to-[#F2C4B2]',
    'img-bg-2': 'from-[#E0EDD8] to-[#C5DFC0]',
    'img-bg-3': 'from-[#EDE8F8] to-[#D4C8E8]',
    'img-bg-4': 'from-[#FFF3D4] to-[#FFE4A0]',
    'img-bg-5': 'from-[#D4E8F0] to-[#A8CDD8]',
    'img-bg-6': 'from-[#F8E8F0] to-[#E8C0D8]',
    'img-bg-7': 'from-[#E8F4F0] to-[#B8DDD5]',
    'img-bg-8': 'from-[#FDE8D8] to-[#F0C098]',
  };
  return gradients[bg] || 'from-[#FDE8E0] to-[#F2C4B2]';
};

const renderStars = (rating: number): string => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) ? '★' : '☆';
  }
  return stars;
};

export default function ProductMainCard({ 
  product, 
  viewMode,
  onWishlistToggle,
  onQuickView 
}: ProductMainCardProps) {
  const [isWished, setIsWished] = useState(false);

  const bgGradient = getBgGradient(product.bg);

  return (
    <div 
      className={`product-card rounded-[20px] overflow-visible cursor-pointer bg-warm-white relative transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-charcoal/10 ${viewMode === 'list' ? 'grid grid-cols-[220px_1fr] rounded-[16px]' : ''}`}
      onClick={() => onQuickView(product)}
    >
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'rounded-l-[16px] aspect-auto h-[180px]' : 'aspect-square rounded-t-[16px]'}`}>
        <div className={`w-full h-full flex items-center justify-center text-[72px] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 bg-gradient-to-br ${bgGradient}`}>
          {product.emoji}
        </div>
        
        {product.badge && (
          <span className={`absolute top-3 left-3 z-[3] px-[11px] py-1 rounded-full text-[10px] tracking-[0.08em] uppercase font-semibold ${product.badgeType === 'sale' ? 'bg-clay' : product.badgeType === 'new' ? 'bg-sage-dark' : 'bg-[#E07070]'} text-white`}>
            {product.badge}
          </span>
        )}
        
        <div className="absolute top-3 right-3 z-[3] flex flex-col gap-1.5 opacity-0 translate-x-2.5 transition-all duration-300 hover:opacity-100 hover:translate-x-0 group-hover:opacity-100 group-hover:translate-x-0">
          <button 
            className={`w-8.5 h-8.5 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-[15px] shadow-[0_2px_12px_rgba(44,44,44,0.12)] transition-all duration-250 hover:scale-115 hover:bg-white ${isWished ? 'text-clay' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsWished(!isWished); onWishlistToggle(product.id); }}
          >
            {isWished ? '♥' : '♡'}
          </button>
          <button 
            className="w-8.5 h-8.5 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center text-[15px] shadow-[0_2px_12px_rgba(44,44,44,0.12)] transition-all duration-250 hover:scale-115 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            ↗
          </button>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 bg-charcoal/82 backdrop-blur-[6px] rounded-b-[16px] flex items-center justify-center py-3.5 opacity-0 translate-y-2 transition-all duration-300 cursor-pointer z-[2]"
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
        >
          <span className="text-white text-[12px] tracking-[0.12em] uppercase font-medium">Quick View</span>
        </div>
      </div>

      <div className={`p-4 pb-[18px] ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-clay font-medium mb-1.5">{product.cat}</div>
          <h3 className="font-display text-[19px] font-normal text-charcoal leading-tight mb-1.25">{product.name}</h3>
          <p className="text-[12px] text-muted leading-relaxed mb-3">{product.desc}</p>
          <div className="flex items-center gap-1.25 mb-3.5">
            <span className="text-gold text-[12px] tracking-[1px]">{renderStars(product.rating)}</span>
            <span className="text-[12px] text-muted">{product.rating} ({product.reviews.toLocaleString()})</span>
          </div>
        </div>
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[20px] font-medium text-charcoal">${product.price}.00</span>
              {product.oldPrice && (
                <span className="text-[13px] text-muted line-through">${product.oldPrice}</span>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

