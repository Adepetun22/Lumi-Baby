import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/Product/CartItem';

// ==================== INTERFACES ====================
interface Product {
  id: number;
  emoji: string;
  bg: string;
  brand: string;
  name: string;
  variant: string;
  price: number;
  oldPrice?: number;
}

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

// ==================== MOCK DATA (from cart.html + project patterns) ====================
const PRODUCTS: Product[] = [
  { id: 1, emoji: '🌙', bg: 'from-[#EDE8F8] to-[#D4C8E8]', brand: 'Dreamland', name: 'Luna Sound Machine', variant: 'Lavender Dream · Standard', price: 54, oldPrice: 68 },
  { id: 2, emoji: '🍼', bg: 'from-[#FDE8E0] to-[#F2C4B2]', brand: 'Lumi Originals', name: 'Bloom Glass Bottle', variant: '8oz · 2-Pack', price: 28 },
  { id: 3, emoji: '🌿', bg: 'from-[#E0EDD8] to-[#C5DFC0]', brand: 'NatureBorn', name: 'Cloud Organic Swaddle', variant: 'S/M · Sage', price: 42 },
  { id: 19, emoji: '🦋', bg: 'from-[#EDE8F8] to-[#D4C8E8]', brand: 'SoftCloud', name: 'Arch Activity Gym', variant: 'Rainbow', price: 78, oldPrice: 95 },
  { id: 20, emoji: '📖', bg: 'from-[#FFF3D4] to-[#FFE4A0]', brand: 'Lumi Originals', name: 'Memory Book — Year 1', variant: 'Blush', price: 46 },
];

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

const UPSELL_PRODUCTS: Product[] = [
  { id: 99, emoji: '🌿', bg: 'from-[#E0EDD8] to-[#C5DFC0]', brand: 'NatureBorn', name: 'Bamboo Wipes Refill', variant: 'One size', price: 14 },
  { id: 98, emoji: '🌸', bg: 'from-[#FDE8E0] to-[#F2C4B2]', brand: 'Lumi Originals', name: 'Petal Rattle Set', variant: 'One size', price: 22 },
  { id: 97, emoji: '⭐', bg: 'from-[#FFF3D4] to-[#FFE4A0]', brand: 'Dreamland', name: 'Star Projector', variant: 'One size', price: 72 },
];

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9100] bg-charcoal text-white px-6 py-3.5 rounded-full text-sm flex items-center gap-2.5 shadow-2xl translate-y-4 opacity-0 animate-[toast-enter_0.3s_ease-out]">
      <span>{icon}</span>
      <span>{msg}</span>
    </div>
  );
};

// ==================== MINI CART DRAWER ====================
const MiniCartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cartCounts: Record<number, number>;
}> = ({ isOpen, onClose, cartCounts }) => {
  const cartItems = PRODUCTS.filter(p => cartCounts[p.id] > 0).map(p => ({
    ...p,
    qty: cartCounts[p.id] || 0,
  }));

  return (
    <>
      <div className={`fixed inset-0 z-[900] bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 z-[901] w-[440px] max-w-full bg-warm-white flex flex-col transform transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 pb-5 border-b border-clay/10 flex items-center justify-between flex-shrink-0">
          <div className="font-display text-2xl font-normal">Your <span className="text-clay italic">Cart</span></div>
          <button className="w-9 h-9 rounded-full border border-clay/20 bg-transparent flex items-center justify-center text-lg text-muted hover:bg-clay/10 hover:text-clay transition-all" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 pb-6 scrollbar-thin scrollbar-thumb-clay/30 scrollbar-track-transparent">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
              <div className="text-5xl mb-4 opacity-60">🛍</div>
              <h3 className="font-display text-2xl font-normal mb-2">Empty cart</h3>
              <p className="text-sm text-muted mb-6">Add some beautiful essentials for your little one.</p>
              <a href="/products" className="px-8 py-3.5 bg-clay text-white rounded-full text-xs tracking-widest uppercase font-medium hover:bg-clay-dark transition-all">Browse Products</a>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3.5 items-center py-4 border-b border-clay/5 last:border-b-0 animate-slide-in">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.bg} text-2xl font-light`} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-normal text-charcoal truncate mb-1 leading-tight">{item.name}</div>
                  <div className="text-xs text-muted mb-3">{item.variant}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-clay rounded-full overflow-hidden h-[26px]">
                      <button className="w-6 h-full border-none bg-transparent text-white text-lg flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => {}}>
                        −
                      </button>
                      <span className="text-xs text-white px-3 font-medium min-w-[2rem] text-center">{item.qty}</span>
                      <button className="w-6 h-full border-none bg-transparent text-white text-lg flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => {}}>
                        +
                      </button>
                    </div>
                    <span className="text-base font-medium text-charcoal">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-6 h-6 rounded text-muted hover:text-red transition-colors" onClick={() => {}}>✕</button>
              </div>
            ))
          )}
        </div>
        <div className="p-5 pt-0 border-t border-clay/10 bg-warm-white">
          {/* Free shipping bar placeholder */}
          <div className="mb-4 p-2.5 bg-green-light border border-green/15 rounded-lg text-xs text-green flex items-center gap-2">
            🚚 Almost there! $12.50 more for free shipping
          </div>
          <div className="text-sm mb-2">
            <span className="text-muted">Subtotal:</span>
            <span className="font-medium ml-auto block">$124.00</span>
          </div>
          <div className="text-sm mb-6">
            <span className="text-muted">Shipping:</span>
            <span className="font-medium ml-auto block text-green">Free</span>
          </div>
          <div className="text-lg font-display mb-4 flex justify-between items-baseline">
            <span>Total</span>
            <span className="text-2xl font-light text-clay">$124.00</span>
          </div>
          <a href="/cart" className="block w-full py-4 rounded-full bg-clay text-white text-xs tracking-widest uppercase font-medium text-center hover:bg-clay-dark transition-all mb-3">View Full Cart</a>
          <button className="w-full py-3.5 rounded-full border border-clay/20 text-xs tracking-widest uppercase font-medium text-muted bg-transparent hover:border-charcoal hover:text-charcoal hover:bg-transparent transition-all">Continue Shopping</button>
        </div>
      </div>
    </>
  );
};

// ==================== MAIN CART COMPONENT ====================
const Cart: React.FC = () => {
  const { cartCounts, totalCount, increment, decrement, setQty } = useCart();
  
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [toast, setToast] = useState<{ msg: string; icon?: string } | null>(null);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  // Computed cart items (only items with qty > 0)
  const cartItems = PRODUCTS.filter(p => cartCounts[p.id] > 0).map(p => ({
    ...p,
    qty: cartCounts[p.id] || 0,
  }));

  // Computed values (port from JS)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = cartItems.reduce((sum, item) => (item.oldPrice ? (item.oldPrice - item.price) * item.qty : 0) + sum, 0);
  const discount = activePromo 
    ? activePromo.type === 'percent' 
      ? subtotal * (activePromo.value / 100) 
      : 0 
    : 0;
  const shippingCost = activePromo?.type === 'freeship' || (subtotal - discount) >= FREE_SHIP_THRESHOLD 
    ? 0 
    : selectedShipping.price;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = Math.max(0, subtotal - discount + shippingCost + tax);

  // Toast handler
  const showToast = useCallback((msg: string, icon?: string) => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Handlers
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

  // Effects
  useEffect(() => {
    if (totalCount === 0) setActivePromo(null);
  }, [totalCount]);

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Toast */}
      {toast && <Toast msg={toast.msg} icon={toast.icon} />}

      {/* Mini Cart Drawer */}
      <MiniCartDrawer isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} cartCounts={cartCounts} />

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
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-clay rounded-full" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Strip */}
      <div className="bg-charcoal/90 py-4 px-12 border-b border-white/5">
        <div className="flex items-center gap-0 max-w-[420px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-cream">
            <div className="w-6 h-6 rounded-full border border-cream bg-clay text-white flex items-center justify-center text-xs font-bold">1</div>
            <span>Cart</span>
          </div>
          <div className="flex-1 h-px bg-white/20 mx-3" />
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-cream/35">
            <div className="w-6 h-6 rounded-full border-2 border-cream/35 flex items-center justify-center text-xs font-bold">2</div>
            <span>Shipping</span>
          </div>
          <div className="flex-1 h-px bg-white/12 mx-3" />
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-cream/35">
            <div className="w-6 h-6 rounded-full border-2 border-cream/35 flex items-center justify-center text-xs font-bold">3</div>
            <span>Payment</span>
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 px-12 pb-20 pt-9 max-w-6xl mx-auto">
          
          {/* Cart Items Column */}

          <div>
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

            {/* Upsell */}
            <div className="mt-8 pt-8 border-t border-clay/10">
              <h3 className="font-display text-2xl font-normal mb-3.5 text-charcoal">You might also <em className="italic text-clay">love</em></h3>
              <div className="flex gap-3.5 overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-clay/30 scrollbar-track-transparent snap-x snap-mandatory">
                {UPSELL_PRODUCTS.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[160px] bg-warm-white rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 snap-center">
                    <div className={`h-24 flex items-center justify-center text-4xl bg-gradient-to-br ${product.bg}`} />
                    <div className="p-3 pb-4">
                      <h4 className="font-display text-base font-normal text-charcoal leading-tight mb-1.5">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-clay">${product.price}</span>
                        <button 
                          className="w-7 h-7 rounded-full border-none bg-clay text-white text-lg flex items-center justify-center hover:bg-clay-dark transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            increment(product.id);
                            showToast(`${product.name} added!`, '🛍️');
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-[92px]">
            <div className="bg-warm-white rounded-2xl border border-clay/10 overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-5 border-b border-clay/10">
                <h2 className="font-display text-2xl font-normal">Order <em className="italic text-clay">Summary</em></h2>
              </div>

              {/* Promo */}
              <div className="p-5 pb-4 border-b border-clay/10">
                <div className="text-xs tracking-[0.15em] uppercase text-charcoal font-medium mb-2.5">Promo Code</div>
                <div className="flex gap-2 flex-wrap">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-2.5 rounded-full border-2 border-clay/20 bg-cream font-body text-sm placeholder:text-muted focus:border-clay focus:outline-none transition-all"
                    placeholder="Enter code e.g. LUMI20"
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo(e.currentTarget.value)}
                  />
                  <button 
                    className="px-6 py-2.5 rounded-full border-none bg-charcoal text-white font-body text-xs tracking-[0.12em] uppercase font-medium hover:bg-clay transition-all whitespace-nowrap"
                    onClick={() => applyPromo((document.querySelector('input[type="text"]') as HTMLInputElement)?.value || '')}
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
                  Try: <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => applyPromo('LUMI20')}>LUMI20</span> ·{' '}
                  <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => applyPromo('WELCOME10')}>WELCOME10</span> ·{' '}
                  <span className="font-mono text-clay cursor-pointer hover:underline" onClick={() => applyPromo('FREESHIP')}>FREESHIP</span>
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
                  <span id="shipping-preview">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {shippingCost === 0 && (
                  <div className="flex justify-between items-center py-2 text-sm text-green">
                    <span>🎉 Free shipping applied!</span>
                    <span>-${shippingCost.toFixed(2)}</span>
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
                      <label key={opt.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-clay/20 cursor-pointer hover:border-clay hover:bg-blush-light transition-all group">
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
                <button className="w-full py-4.5 rounded-full border-none bg-clay text-white font-body text-xs tracking-[0.15em] uppercase font-medium flex items-center justify-center gap-2.5 hover:bg-clay-dark hover:-translate-y-0.5 hover:shadow-clay/30 transition-all mb-3">
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
                  SSL encrypted · Safe & secure checkout
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
        </div>
      )}

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
};

export default Cart;

