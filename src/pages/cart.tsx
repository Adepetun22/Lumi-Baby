import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/Product/CartItem';
import Stepper from '../components/Stepper';
import { ALL_PRODUCTS, getBgGradient } from '../data/products';

// ==================== INTERFACES ====================
interface PromoCode {
  code: string;
  type: 'percent' | 'freeship';
  value: number;
  label: string;
}

interface ShippingOption {
  id: string;
  label: string;
  sub: string;
  price: number;
}

const PROMO_CODES: Record<string, PromoCode> = {
  'LUMI20': { code: 'LUMI20', type: 'percent', value: 20, label: 'LUMI20 — 20% off' },
  'WELCOME10': { code: 'WELCOME10', type: 'percent', value: 10, label: 'WELCOME10 — 10% off' },
  'FREESHIP': { code: 'FREESHIP', type: 'freeship', value: 0, label: 'FREESHIP — Free shipping' },
};

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', label: 'Standard Shipping', sub: '5–7 business days', price: 6.99 },
  { id: 'express', label: 'Express Shipping', sub: '2–3 business days', price: 14.99 },
  { id: 'overnight', label: 'Overnight', sub: 'Next business day', price: 24.99 },
];

const UPSELL_PRODUCTS = ALL_PRODUCTS.filter(p => [6, 8, 17].includes(p.id));

const TAX_RATE = 0.08;
const FREE_SHIP_THRESHOLD = 80;

// ==================== TOAST ====================
const Toast: React.FC<{ msg: string; icon?: string }> = ({ msg, icon = '🛍' }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9100] bg-charcoal text-white px-6 py-3.5 rounded-full text-sm flex items-center gap-2.5 shadow-2xl">
      <span>{icon}</span>
      <span>{msg}</span>
    </div>
  );
};

// ==================== UPSELL CARD ====================
const UpsellCard: React.FC<{ product: typeof UPSELL_PRODUCTS[0]; onAdd: () => void }> = ({ product, onAdd }) => (
  <div className="flex-shrink-0 w-[160px] bg-warm-white rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 snap-center">
    <div className={`h-24 flex items-center justify-center text-4xl bg-gradient-to-br ${getBgGradient(product.bg)}`}>{product.emoji}</div>
    <div className="p-3 pb-4">
      <h4 className="font-display text-base font-normal text-charcoal leading-tight mb-1.5">{product.name}</h4>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-clay">${product.price}</span>
        <button
          className="w-7 h-7 rounded-full border-none bg-clay text-white text-lg flex items-center justify-center hover:bg-clay-dark transition-all"
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
        >+</button>
      </div>
    </div>
  </div>
);

// ==================== MAIN CART COMPONENT ====================
const Cart: React.FC = () => {
  const { cartCounts, totalCount, increment, setQty } = useCart();

  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [toast, setToast] = useState<{ msg: string; icon?: string } | null>(null);
  const [promoInput, setPromoInput] = useState('');

  const cartItems = ALL_PRODUCTS.filter(p => cartCounts[p.id] > 0).map(p => ({
    ...p,
    bg: getBgGradient(p.bg),
    qty: cartCounts[p.id] || 0,
    brand: p.cat,
    variant: p.variant || 'Default Variant',
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = cartItems.reduce((sum, item) => (item.oldPrice ? (item.oldPrice - item.price) * item.qty : 0) + sum, 0);
  const discount = activePromo?.type === 'percent' ? subtotal * (activePromo.value / 100) : 0;
  const shippingCost = activePromo?.type === 'freeship' || (subtotal - discount) >= FREE_SHIP_THRESHOLD ? 0 : selectedShipping.price;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = Math.max(0, subtotal - discount + shippingCost + tax);

  const showToast = useCallback((msg: string, icon?: string) => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const applyPromo = (code: string) => {
    const promo = PROMO_CODES[code.toUpperCase()];
    if (promo) {
      setActivePromo(promo);
      showToast('Promo code applied! 🎉', '🏷');
    } else {
      showToast('Invalid code', '❌');
    }
  };

  const removePromo = () => {
    setActivePromo(null);
    showToast('Promo code removed', '✕');
  };

  const updateQty = (id: number, qty: number) => {
    setQty(id, qty);
    showToast('Updated', '✏️');
  };

  const clearCart = () => {
    Object.keys(cartCounts).forEach(key => setQty(parseInt(key), 0));
    setActivePromo(null);
    showToast('Cart cleared', '🗑');
  };

  useEffect(() => {
    if (totalCount === 0) setActivePromo(null);
  }, [totalCount]);

  return (
    <div className="cart-page min-h-screen bg-cream pt-[72px]">
      {toast && <Toast msg={toast.msg} icon={toast.icon} />}

      {/* Hero */}
      <section className="bg-charcoal py-13 px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-4 font-display text-[14rem] font-light flex items-center justify-center tracking-tighter pointer-events-none select-none text-cream leading-none">
          Cart
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-cream/50 mb-3">
            <div className="w-6 h-px bg-cream/30" />
            Lumi Baby · Shop
          </div>
          <h1 className="font-display text-[clamp(3.5rem,8vw,5.5rem)] font-light text-cream leading-tight">
            Your Shopping <em className="italic text-blush">Cart</em>
          </h1>
          <div className="flex items-center gap-5 mt-3.5 flex-wrap text-xs text-cream/50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-clay rounded-full" />
              <span>{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-clay rounded-full" />
              <span>Free shipping over $80</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-clay rounded-full" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </section>

      <Stepper steps={['Cart', 'Shipping', 'Payment']} currentStep={0} />

      {cartItems.length === 0 ? (
        <div className="text-center py-20 px-6 max-w-md mx-auto">
          <div className="text-6xl mb-6 animate-bounce">🛍</div>
          <h2 className="font-display text-4xl font-light mb-3 text-charcoal leading-tight">
            Your cart is <em className="italic text-clay">empty</em>
          </h2>
          <p className="text-muted text-lg mb-8 leading-relaxed">Looks like you haven't added anything yet. Explore our curated collection of premium baby essentials.</p>
          <Link to="/products" className="inline-flex items-center gap-2.5 px-10 py-4 bg-clay text-white rounded-full font-body text-xs tracking-[0.15em] uppercase font-medium hover:bg-clay-dark transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 px-6 lg:px-12 pb-20 pt-9 max-w-6xl mx-auto">

          {/* Cart Items Column */}
          <div className="order-1 lg:order-1">
            <div className="flex items-center justify-between mb-5">
              <div className="font-display text-3xl font-normal">Cart <span className="text-clay italic">Items</span></div>
              <button className="text-xs text-muted underline hover:text-red transition-colors font-body" onClick={clearCart}>
                Remove all
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-[80px_1.8fr_1fr_1fr_1fr_40px] gap-3 pb-3 mb-6 border-b border-clay/10 text-xs tracking-[0.18em] uppercase text-muted font-medium">
              <div />
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Subtotal</div>
              <div />
            </div>

            {/* Items */}
            <div className="space-y-5">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} updateQty={updateQty} />
              ))}
            </div>

            {/* Savings Banner */}
            {savings > 0 && (
              <div className="mt-8 p-3.5 bg-green-light border border-green/15 rounded-xl flex items-center gap-3 text-sm text-green">
                <span className="text-xl">🎉</span>
                <span>You're saving <strong>${savings.toFixed(2)}</strong> on this order!</span>
              </div>
            )}

            {/* Upsell — desktop only */}
            <div className="hidden lg:block mt-8 pt-8 border-t border-clay/10">
              <h3 className="font-display text-2xl font-normal mb-3.5 text-charcoal">You might also <em className="italic text-clay">love</em></h3>
              <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-clay/30 scrollbar-track-transparent snap-x snap-mandatory">
                {UPSELL_PRODUCTS.map((product) => (
                  <UpsellCard key={product.id} product={product} onAdd={() => { increment(product.id); showToast(`${product.name} added!`, '🛍️'); }} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-2 lg:order-2 lg:sticky lg:top-[92px] self-start">
            <div className="bg-warm-white rounded-2xl border border-clay/10 overflow-hidden">
              <div className="p-6 pb-5 border-b border-clay/10">
                <h2 className="font-display text-2xl font-normal">Order <em className="italic text-clay">Summary</em></h2>
              </div>

              {/* Promo */}
              <div className="p-5 pb-4 border-b border-clay/10">
                <div className="text-xs tracking-[0.15em] uppercase text-charcoal font-medium mb-2.5">Promo Code</div>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full border-2 border-clay/20 bg-cream font-body text-sm placeholder:text-muted focus:border-clay focus:outline-none transition-all"
                    placeholder="Enter code e.g. LUMI20"
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo(promoInput)}
                  />
                  <button
                    className="px-6 py-2.5 rounded-full border-none bg-charcoal text-white font-body text-xs tracking-[0.12em] uppercase font-medium hover:bg-clay transition-all whitespace-nowrap"
                    onClick={() => applyPromo(promoInput)}
                  >
                    Apply
                  </button>
                </div>
                {activePromo && (
                  <div className="flex items-center gap-2 mt-2.5 px-3.5 py-2 bg-green-light border border-green/15 rounded-lg text-sm text-green">
                    <span>{activePromo.label}</span>
                    <button className="ml-auto text-lg hover:text-red transition-colors" onClick={removePromo}>✕</button>
                  </div>
                )}
                <div className="mt-2 text-xs text-muted">
                  Try:{' '}
                  <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => { setPromoInput('LUMI20'); applyPromo('LUMI20'); }}>LUMI20</span>
                  {' · '}
                  <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => { setPromoInput('WELCOME10'); applyPromo('WELCOME10'); }}>WELCOME10</span>
                  {' · '}
                  <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => { setPromoInput('FREESHIP'); applyPromo('FREESHIP'); }}>FREESHIP</span>
                </div>
              </div>

              {/* Line Items */}
              <div className="p-5 pb-4 border-b border-clay/10">
                <div className="flex justify-between items-center py-2 text-sm mb-1">
                  <span className="text-muted">Subtotal ({cartItems.reduce((sum, i) => sum + i.qty, 0)} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm text-green mb-1">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-muted">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {shippingCost === 0 && (
                  <div className="flex justify-between items-center py-2 text-sm text-green">
                    <span>🎉 Free shipping applied!</span>
                    <span>-$0.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-muted">Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="p-5 pb-4 border-b border-clay/10">
                <div className="text-xs tracking-[0.15em] uppercase text-charcoal font-medium mb-2.5">Shipping Method</div>
                <div className="space-y-1.5">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const effectivePrice = shippingCost === 0 ? 0 : opt.price;
                    return (
                      <label key={opt.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-clay/20 cursor-pointer hover:border-clay hover:bg-blush-light transition-all">
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.id}
                          checked={selectedShipping.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                          className="w-4 h-4 accent-clay cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{opt.label}</div>
                          <div className="text-xs text-muted">{opt.sub}</div>
                        </div>
                        <span className={`text-sm font-medium ${effectivePrice === 0 ? 'text-green' : 'text-charcoal'}`}>
                          {effectivePrice === 0 ? 'Free' : `$${opt.price.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Total & CTA */}
              <div className="p-5">
                <div className="flex justify-between items-baseline py-3 border-t-2 border-clay/20 mb-4">
                  <span className="font-display text-2xl font-normal">Total</span>
                  <span className="font-display text-[2rem] font-light text-clay">${total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted mb-4">Including estimated tax. Final amount confirmed at checkout.</div>
                <button className="w-full py-4 rounded-full border-none bg-clay text-white font-body text-xs tracking-[0.15em] uppercase font-medium flex items-center justify-center gap-2.5 hover:bg-clay-dark transition-all mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m-7 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6" />
                    <path d="M12 7V3a2 2 0 0 0-4 0v4a2 2 0 0 0 4 0z" />
                  </svg>
                  Proceed to Checkout
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted mb-3.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  SSL encrypted · Safe &amp; secure checkout
                </div>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  <span className="px-3 py-1.5 bg-cream border border-clay/20 rounded-md text-xs font-medium text-muted tracking-tight">VISA</span>
                  <span className="px-3 py-1.5 bg-cream border border-clay/20 rounded-md text-xs font-medium text-muted tracking-tight">MC</span>
                  <span className="px-3 py-1.5 bg-cream border border-clay/20 rounded-md text-xs font-medium text-muted tracking-tight">AMEX</span>
                  <span className="px-3 py-1.5 bg-cream border border-clay/20 rounded-md text-xs font-medium text-muted tracking-tight">PayPal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upsell — mobile only, below Order Summary */}
          <div className="order-3 lg:hidden pt-2 border-t border-clay/10">
            <h3 className="font-display text-2xl font-normal mb-3.5 text-charcoal">You might also <em className="italic text-clay">love</em></h3>
            <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-clay/30 scrollbar-track-transparent snap-x snap-mandatory">
              {UPSELL_PRODUCTS.map((product) => (
                <UpsellCard key={product.id} product={product} onAdd={() => { increment(product.id); showToast(`${product.name} added!`, '🛍️'); }} />
              ))}
            </div>
          </div>

        </div>
      )}

      <div className="h-20" />
    </div>
  );
};

export default Cart;
