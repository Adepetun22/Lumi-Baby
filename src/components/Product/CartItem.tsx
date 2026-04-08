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
    <div className="grid grid-cols-1 md:grid-cols-[80px_1.8fr_1fr_1fr_1fr_40px] gap-3 items-start md:items-center py-4 md:py-5 border-b border-clay/5 last:border-b-0">
      {/* Image */}
      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-3xl hover:scale-105 md:hover:scale-105 transition-transform flex-shrink-0`}>
        {item.emoji}
      </div>

      {/* Product Details */}
      <div className="md:col-span-1">
        <div className="text-xs tracking-[0.15em] uppercase text-clay font-medium mb-0.5 md:mb-1">{item.brand}</div>
        <div className="font-display text-lg md:text-2xl font-normal text-charcoal leading-tight mb-1 md:mb-1.5">{item.name}</div>
        <div className="flex flex-wrap gap-1 md:gap-2">
          {item.variant.split(' · ').map((v, i) => (
            <span key={i} className="text-xs text-muted bg-cream border border-clay/20 rounded-md px-2 py-0.5">{v}</span>
          ))}
        </div>
      </div>

      {/* Unit Price - hidden on mobile, shown center on desktop */}
      <div className="hidden md:block text-base font-medium text-center">${item.price.toFixed(2)}</div>

      {/* Quantity + Subtotal row (mobile: side by side | desktop: separate columns) */}
      <div className="flex items-center justify-between md:contents">
        {/* Quantity Controls */}
        <div className="flex justify-start md:justify-center">
          <div className="flex items-center border-2 border-clay/20 rounded-full overflow-hidden bg-warm-white h-8 md:h-9 w-max">
            <button
              className="w-8 md:w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
              onClick={() => updateQty(item.id, Math.max(0, item.qty - 1))}
            >−</button>
            <span className="px-3 md:px-4 text-sm font-medium min-w-[2rem] md:min-w-[2.25rem] text-center">{item.qty}</span>
            <button
              className="w-8 md:w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
              onClick={() => updateQty(item.id, item.qty + 1)}
            >+</button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-xl md:text-2xl font-display font-light text-charcoal text-right md:text-center">
          ${(item.price * item.qty).toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        className="w-8 h-8 flex items-center justify-center text-muted hover:text-red hover:bg-red/10 rounded-full transition-all ml-auto md:mx-auto md:col-start-6"
        onClick={() => updateQty(item.id, 0)}
        title="Remove item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;

