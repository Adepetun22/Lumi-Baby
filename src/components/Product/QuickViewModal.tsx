import { useState, useEffect } from 'react';

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
  increment: (id: number) => void;
}

export default function QuickViewModal({ 
  product, 
  isOpen, 
  onClose,
  increment
}: QuickViewModalProps) {
  const [localQty, setLocalQty] = useState(1);

  useEffect(() => {
    setLocalQty(1);
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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

  const totalPrice = localQty * product.price;
  const totalOldPrice = localQty * (product.oldPrice || 0);
  const savings = totalOldPrice > 0 ? Math.round((1 - totalPrice / totalOldPrice) * 100) : 0;

  return (
    <div 
      className={`fixed inset-0 z-1000 bg-charcoal/55 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="bg-warm-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)' }}
      >
        {/* Image Side */}
        <div className={`relative rounded-l-3xl overflow-hidden min-h-96 flex items-center justify-center bg-gradient-to-br ${getBgGradient(product.bg)}`}>
          <button 
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border-none cursor-pointer text-lg flex items-center justify-center hover:bg-white transition-all z-10"
            onClick={onClose}
          >
            ✕
          </button>
          <span className="text-[100px]">{product.emoji}</span>
        </div>

        {/* Content Side */}
        <div className="p-9 pb-8 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-clay font-medium mb-2">{product.cat}</div>
          <h2 className="font-display text-4xl font-normal leading-tight mb-2">{product.name}</h2>
          <div className="flex items-center gap-1.5 mb-4 text-sm text-muted">
            <span className="text-gold">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>🌱</span> Organic
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>🛡️</span> BPA-free
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>✈️</span> Free shipping
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-6">
            {product.desc} Meets or exceeds all ASTM and CPSC safety standards.
          </p>

          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-widest text-charcoal mb-3 font-medium">Size / Variant</h4>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <div
                  key={variant}
                  className="px-4 py-1.5 rounded-3xl border border-clay/20 text-xs cursor-pointer transition-all hover:border-clay hover:text-clay text-muted"
                >
                  {variant}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-medium text-charcoal">${totalPrice.toLocaleString()}.00</span>
            {product.oldPrice && (
              <>
                <span className="text-base text-muted line-through">${totalOldPrice.toLocaleString()}</span>
                <span className="px-2 py-1 bg-clay/20 text-clay rounded-md text-xs font-semibold">Save {savings}%</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center bg-clay rounded-full overflow-hidden">
              <button 
                className="w-8 h-8 border-none bg-transparent text-white text-lg cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLocalQty(Math.max(1, localQty - 1)); }}
              >
                −
              </button>
              <span className="text-xs text-white px-3 font-medium min-w-7 text-center">{localQty}</span>
              <button 
                className="w-8 h-8 border-none bg-transparent text-white text-lg cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLocalQty(localQty + 1); }}
              >
                +
              </button>
            </div>
            <button 
              className="flex-1 py-4 rounded-3xl border-none bg-clay text-white font-medium text-sm tracking-tight uppercase cursor-pointer transition-all hover:bg-clay-dark hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => {
                if (localQty > 0) {
                  for (let i = 0; i < localQty; i++) {
                    increment(product.id);
                  }
                }
                onClose();
              }}
            >
              Add to Cart ({localQty}x) — ${totalPrice.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

