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
    <>
      {/* Mobile layout (< md) */}
      <div className="flex gap-3 items-start py-4 border-b border-clay/5 last:border-b-0 md:hidden">
        <div className={`w-20 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br ${item.bg} flex items-center justify-center text-3xl`}>
          {item.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs tracking-[0.15em] uppercase text-clay font-medium mb-0.5">{item.brand}</div>
          <div className="font-display text-lg font-normal text-charcoal leading-tight mb-1">{item.name}</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {item.variant.split(' · ').map((v, i) => (
              <span key={i} className="text-xs text-muted bg-cream border border-clay/20 rounded-md px-2 py-0.5">{v}</span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center border-2 border-clay/20 rounded-full overflow-hidden bg-warm-white h-8 w-max">
              <button
                className="w-8 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
                onClick={() => updateQty(item.id, item.qty - 1)}
              >−</button>
              <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.qty}</span>
              <button
                className="w-8 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
                onClick={() => updateQty(item.id, item.qty + 1)}
              >+</button>
            </div>
            <span className="font-display text-xl font-light text-charcoal">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-red hover:bg-red/10 rounded-full transition-all flex-shrink-0"
          onClick={() => updateQty(item.id, 0)}
          title="Remove item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Desktop layout (md+) */}
      <div className="hidden md:grid grid-cols-[80px_1.8fr_1fr_1fr_1fr_40px] gap-3 items-center py-5 border-b border-clay/5 last:border-b-0">
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-3xl hover:scale-105 transition-transform`}>
          {item.emoji}
        </div>

        <div>
          <div className="text-xs tracking-[0.15em] uppercase text-clay font-medium mb-1">{item.brand}</div>
          <div className="font-display text-2xl font-normal text-charcoal leading-tight mb-1.5">{item.name}</div>
          <div className="flex flex-wrap gap-2">
            {item.variant.split(' · ').map((v, i) => (
              <span key={i} className="text-xs text-muted bg-cream border border-clay/20 rounded-md px-2 py-0.5">{v}</span>
            ))}
          </div>
        </div>

        <div className="text-base font-medium text-center">${item.price.toFixed(2)}</div>

        <div className="flex justify-center">
          <div className="flex items-center border-2 border-clay/20 rounded-full overflow-hidden bg-warm-white h-9 w-max">
            <button
              className="w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
              onClick={() => updateQty(item.id, item.qty - 1)}
            >−</button>
            <span className="px-4 text-sm font-medium min-w-[2.25rem] text-center">{item.qty}</span>
            <button
              className="w-9 h-full border-none bg-transparent text-lg flex items-center justify-center text-charcoal hover:bg-clay/10 transition-colors"
              onClick={() => updateQty(item.id, item.qty + 1)}
            >+</button>
          </div>
        </div>

        <div className="text-2xl font-display font-light text-charcoal text-center">
          ${(item.price * item.qty).toFixed(2)}
        </div>

        <button
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-red hover:bg-red/10 rounded-full transition-all mx-auto"
          onClick={() => updateQty(item.id, 0)}
          title="Remove item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default CartItem;
