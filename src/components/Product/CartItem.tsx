import React from 'react';

interface CartItemProps {
  item: {
    id: number;
    emoji: string;
    bg: string;
    brand: string;
    name: string;
    variant: string;
    price: number;
    qty: number;
  };
  updateQty: (id: number, qty: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQty }) => {
  return (
    <div className="grid grid-cols-[80px_1.8fr_1fr_1fr_1fr_40px] lg:grid-cols-[80px_1.8fr_1fr_1fr_1fr_40px] grid-rows-[auto_auto] lg:grid-rows-1 gap-3 items-start py-5.5 border-b border-clay/5 last:border-b-0">
      {/* Image */}
      <div className={`w-20 h-20 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.bg} text-3xl font-light transform hover:scale-105 transition-transform`}>
        {item.emoji}
      </div>
      
      {/* Product Info */}
      <div className="lg:col-span-1">
        <div className="text-xs tracking-[0.15em] uppercase text-clay font-medium mb-1">{item.brand}</div>
        <div className="font-display text-2xl font-normal text-charcoal leading-tight mb-1.5">{item.name}</div>
        <div className="flex flex-wrap gap-2">
          {item.variant.split(' · ').map((v, i) => (
            <span key={i} className="text-xs text-muted bg-cream border border-clay/20 rounded-md px-2 py-0.5">{v}</span>
          ))}
        </div>
      </div>

      {/* Price (desktop) */}
      <div className="text-base font-medium text-center hidden lg:block">${item.price.toFixed(2)}</div>

      {/* Quantity */}
      <div className="justify-self-center">
        <div className="flex items-center border-2 border-clay/20 rounded-full overflow-hidden bg-warm-white h-9 w-max">
          <button 
            className="w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors" 
            onClick={() => updateQty(item.id, item.qty - 1)}
          >
            −
          </button>
          <span className="px-4 text-sm font-medium min-w-[2.25rem] text-center">{item.qty}</span>
          <button 
            className="w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors" 
            onClick={() => updateQty(item.id, item.qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal (desktop) */}
      <div className="text-2xl font-display font-light text-charcoal text-center hidden lg:block">
        ${(item.price * item.qty).toFixed(2)}
      </div>

      {/* Mobile Meta: price · qty · subtotal */}
      <div className="lg:hidden col-span-2 flex items-center gap-3 pt-2 mt-2 border-t border-clay/10">
        <span className="text-sm text-muted whitespace-nowrap">${item.price.toFixed(2)} each</span>
        <div className="flex items-center border border-clay/20 rounded-full overflow-hidden bg-warm-white h-[30px] flex-shrink-0">
          <button className="w-[26px] h-full border-none bg-transparent text-base flex items-center justify-center text-charcoal hover:bg-clay/10" onClick={() => updateQty(item.id, item.qty - 1)}>
            −
          </button>
          <span className="px-2 text-sm font-medium min-w-[28px] text-center">{item.qty}</span>
          <button className="w-[26px] h-full border-none bg-transparent text-base flex items-center justify-center text-charcoal hover:bg-clay/10" onClick={() => updateQty(item.id, item.qty + 1)}>
            +
          </button>
        </div>
        <span className="ml-auto text-xl font-display font-normal text-charcoal whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</span>
      </div>

      {/* Remove */}
      <button 
        className="w-8 h-8 rounded-full border-none bg-transparent flex items-center justify-center text-muted hover:bg-red/10 hover:text-red transition-all self-start ml-auto lg:ml-0"
        onClick={() => updateQty(item.id, 0)}
        title="Remove item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;

