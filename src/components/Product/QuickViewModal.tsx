import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';

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

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  cartCounts: Record<number, number>;
  increment: (id: number) => void;
}

export default function QuickViewModal({ 
  product, 
  isOpen, 
  onClose,
  cartCounts,
  increment
}: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [localQty, setLocalQty] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!product) return null;

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

  const bgGradient = getBgGradient(product.bg);
  const totalPrice = localQty * product.price;
  const totalOldPrice = localQty * (product.oldPrice || 0);
  const savings = totalOldPrice > 0 ? Math.round((1 - totalPrice / totalOldPrice) * 100) : 0;

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-charcoal/55 backdrop-blur-[8px] flex items-center justify-center transition-opacity duration-35 \${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="bg-warm-white rounded-[24px] max-w-[820px] w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-[0_32px_80px_rgba(44,44,44,0.25)] transition-transform duration-40 ease-[cubic-bezier(0.22,1,0.36,1)]"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)' }}
      >
        {/* Image Side */}
        <div className={`relative rounded-[24px_0_0_24px] overflow-hidden min-h-[380px] flex items-center justify-center bg-gradient-to-br \${bgGradient}`}>
          <button 
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 border-none cursor-pointer text-[16px] flex items-center justify-center hover:bg-white transition-colors z-[2]"
            onClick={onClose}
          >
            ✕
          </button>
          <span className="text-[100px]">{product.emoji}</span>
        </div>

        {/* Content Side */}
        <div className="p-9 pb-8 flex flex-col">
          <div className="text-[11px] tracking-[0.2em] uppercase text-clay font-medium mb-2">{product.cat}</div>
          <h2 className="font-display text-[30px] font-normal leading-tight mb-2">{product.name}</h2>
          <div className="flex items-center gap-1.5 mb-4 text-[13px] text-muted">
            <span className="text-gold">{'★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex gap-4 mb-5.5">
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>🌱</span> Organic
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>🛡️</span> BPA-free
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <span>✈️</span> Free shipping
            </div>
          </div>

          <p className="text-[14px] text-muted leading-relaxed mb-6">
            {product.desc} Meets or exceeds all ASTM and CPSC safety standards.
          </p>

          <div className="mb-5.5">
            <h4 className="text-[12px] tracking-[0.12em] uppercase text-charcoal mb-2.5 font-medium">Size / Variant</h4>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, i) => (
                <div
                  key={variant}
                  className={`variant-pill px-4 py-1.75 rounded-[20px] border border-clay/14 text-[13px] cursor-pointer transition-all hover:border-clay hover:text-clay \${selectedVariant === i ? 'bg-clay border-clay text-white' : 'text-muted'}`}
                  onClick={() => setSelectedVariant(i)}
                >
                  {variant}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[28px] font-medium text-charcoal">\${(localQty * product.price).toLocaleString()}.00</span>
            {product.oldPrice && (
              <>
                <span className="text-[16px] text-muted line-through">\${(localQty * (product.oldPrice || 0)).toLocaleString()}</span>
                <span className="px-2.5 py-1 bg-clay-light text-clay rounded-[6px] text-[12px] font-semibold">Save {savings}%</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-0 bg-clay rounded-full overflow-hidden">
              <button 
                className="w-8 h-8 border-none bg-transparent text-white text-[18px] cursor-pointer flex items-center justify-center hover:bg-white/15"
                onClick={(e) => { e.stopPropagation(); setLocalQty(Math.max(1, localQty - 1)); }}
              >
                −
              </button>
              <span className="text-[13px] text-white px-2.5 font-medium min-w-[28px] text-center">{localQty}</span>
              <button 
                className="w-8 h-8 border-none bg-transparent text-white text-[18px] cursor-pointer flex items-center justify-center hover:bg-white/15"
                onClick={(e) => { e.stopPropagation(); setLocalQty(localQty + 1); }}
              >
                +
              </button>
            </div>
            <button 
              className="flex-1 py-[15px] rounded-full border-none bg-clay text-white font-body text-[13px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 hover:bg-[#b56a49] hover:-translate-y-0.5"
              onClick={() => {
                if (localQty > 0) {
                  for (let i = 0; i < localQty; i++) {
                    increment(product.id);
                  }
                }
                onClose();
              }}
            >
              Add to Cart ({localQty}x) — \${(localQty * product.price).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

