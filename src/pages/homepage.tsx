import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { cursorRef, followerRef };
}

// Scroll Reveal Hook
function useScrollReveal() {
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setRevealedElements((prev) => new Set(prev).add(entry.target.className));
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return revealedElements;
}

// ==================== COMPONENTS ====================

// Hero Section
function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroWrap = heroRef.current;
    if (!heroWrap) return;

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx * 12;
      targetY = (e.clientY - cy) / cy * 8;
    };

    const animateHero = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      heroWrap.style.transform = `perspective(1000px) rotateY(${currentX * 0.3}deg) rotateX(${-currentY * 0.3}deg) scale(1.06) translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
      requestAnimationFrame(animateHero);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateHero();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center" id="hero">
      <div 
        ref={heroRef}
        className="absolute inset-0 will-change-transform transition-transform duration-100"
        style={{ transform: 'scale(1.06)' }}
      >
        <div className="w-full h-full bg-cover bg-center relative" style={{ background: 'linear-gradient(135deg, #8FAF8A 0%, #C97B5A 30%, #F2C4B2 60%, #D4E8F0 100%)' }}>
          {/* Animated Blobs */}
          <div className="absolute rounded-full mix-blend-soft-light animate-blob-float" style={{ width: '500px', height: '500px', background: 'rgba(242,196,178,0.6)', top: '-100px', left: '-100px' }}></div>
          <div className="absolute rounded-full mix-blend-soft-light animate-blob-float" style={{ width: '400px', height: '400px', background: 'rgba(143,175,138,0.5)', bottom: '-80px', right: '-80px', animationDelay: '-3s' }}></div>
          <div className="absolute rounded-full mix-blend-soft-light animate-blob-float" style={{ width: '300px', height: '300px', background: 'rgba(212,232,240,0.7)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '-5s' }}></div>
          
          {/* Stars */}
          <span className="absolute animate-twinkle text-2xl opacity-40" style={{ top: '20%', left: '15%' }}>✦</span>
          <span className="absolute animate-twinkle text-2xl opacity-40" style={{ top: '35%', right: '20%', animationDelay: '1s' }}>✧</span>
          <span className="absolute animate-twinkle text-2xl opacity-40" style={{ bottom: '30%', left: '25%', animationDelay: '2s' }}>✦</span>
          <span className="absolute animate-twinkle opacity-40" style={{ top: '60%', right: '30%', animationDelay: '0.5s' }}>✦</span>
          <span className="absolute animate-twinkle text-2xl opacity-40" style={{ top: '15%', right: '40%', animationDelay: '1.5s' }}>✧</span>

          {/* Central Illustration */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div>
              <div className="text-center animate-blob-float" style={{ fontSize: 'clamp(80px,14vw,180px)', filter: 'drop-shadow(0 20px 60px rgba(201,123,90,0.3))' }}>🍼</div>
              <div className="flex gap-6 justify-center mt-5">
                <span className="text-5xl animate-blob-float" style={{ animationDelay: '0.5s', display: 'block' }}>🧸</span>
                <span className="text-5xl animate-blob-float" style={{ animationDelay: '1s', display: 'block' }}>🌙</span>
                <span className="text-5xl animate-blob-float" style={{ animationDelay: '1.5s', display: 'block' }}>⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/55"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-[800px] px-6">
        <div className="flex items-center justify-center gap-14 mb-6">
          <span className="flex-1 max-14 h-px bg-white/40"></span>
          <span className="font-body text-xs tracking-[0.3em] uppercase text-white/70">New Collection 2025</span>
          <span className="flex-1 max-14 h-px bg-white/40"></span>
        </div>
        <h1 className="font-display text-[clamp(52px,8vw,100px)] font-light leading-[1.05] tracking-tight mb-6 animate-hero-reveal">
          Nurture<br /><em className="italic text-blush">the Wonder</em>
        </h1>
        <p className="text-base font-light tracking-wide text-white/80 mb-12 animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
          Premium baby essentials crafted with love, designed for life's most magical moments.
        </p>
        <div className="flex gap-4 justify-center flex-wrap animate-hero-reveal" style={{ animationDelay: '0.4s' }}>
          <button onClick={() => navigate('/products')} className="px-11 py-4 bg-clay text-white border-none rounded-full font-body text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 font-medium hover:bg-[#b56a49] hover:-translate-y-0.5 hover:shadow-clay/40">Shop Now</button>
          <button className="px-11 py-4 bg-transparent text-white border border-white/50 rounded-full font-body text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 font-medium hover:bg-white/10 hover:border-white hover:-translate-y-0.5">Explore Collections</button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs tracking-widest uppercase animate-fade-in">
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <span className="absolute -top-full left-0 w-full h-full bg-white animate-scroll-line"></span>
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}

// Ticker Component
function Ticker() {
  const items = [
    'Free shipping on orders over $50',
    '100% Organic & Safe Materials',
    'New Arrivals: Spring Collection',
    'Gift Wrapping Available',
    'Trusted by 50,000+ Happy Families',
    'Free Returns Within 30 Days',
  ];

  return (
    <div className="bg-clay text-white py-3 overflow-hidden flex">
      <div className="flex gap-12 whitespace-nowrap animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex-shrink-0 text-xs tracking-widest uppercase flex items-center gap-12">
            <span>{item}</span>
            <span className="text-white/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Categories Section
function Categories() {
  const categories = [
    { icon: '🍼', name: 'Feeding', count: '124 products', color: 'from-blush to-clay', mt: '' },
    { icon: '🌿', name: 'Diapering', count: '87 products', color: 'from-sky to-sage', mt: 'lg:mt-10' },
    { icon: '🌙', name: 'Nursery', count: '210 products', color: 'from-lavender to-purple-400', mt: '' },
    { icon: '🧸', name: 'Toys', count: '195 products', color: 'from-yellow-300 to-orange-400', mt: 'lg:-mt-5' },
    { icon: '👶', name: 'Clothing', count: '302 products', color: 'from-pink-300 to-red-400', mt: 'lg:mt-10' },
    { icon: '🎁', name: 'Gifts', count: '68 products', color: 'from-gold to-yellow-700', mt: '' },
  ];

  return (
    <section className="py-24 px-12 bg-warm-white relative overflow-hidden" id="categories">
      {/* Parallax Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-8xl opacity-15" style={{ top: '10%', left: '5%' }}>☁️</div>
        <div className="absolute text-5xl opacity-15" style={{ top: '60%', right: '8%' }}>☁️</div>
        <div className="absolute text-clay opacity-30" style={{ top: '20%', left: '30%' }}>✦</div>
        <div className="absolute text-clay opacity-30 text-lg" style={{ top: '70%', left: '60%' }}>✧</div>
        <div className="absolute text-clay opacity-30 text-sm" style={{ top: '40%', right: '15%' }}>✦</div>
      </div>

      <div className="relative z-10">
        <div className="mb-16 reveal">
          <div className="flex items-center gap-3 text-clay text-xs tracking-[0.35em] uppercase font-medium mb-3">
            <span className="w-7 h-px bg-clay"></span>
            Shop by Category
          </div>
          <h2 className="font-display text-[clamp(36px,5vw,62px)] font-light leading-tight text-charcoal">
            Everything your<br /><em className="italic text-sage-dark">little one</em> needs
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, i) => (
            <div key={i} className={`reveal reveal-delay-${(i % 4) + 1}`}>
              <div className={`rounded-[20px] overflow-hidden cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2.5 aspect-3/4 ${cat.mt}`}>
                <div className={`w-full h-full flex flex-col items-center justify-end p-5 bg-gradient-to-br ${cat.color} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
                  <span className="text-[40px] mb-2.5 relative z-10">{cat.icon}</span>
                  <span className="font-display text-lg font-normal text-white text-center relative z-10 drop-shadow-lg">{cat.name}</span>
                  <span className="text-xs text-white/70 mt-1 relative z-10">{cat.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ badge, badgeType, bgColor, icon, name, sub, price, rating, reviews, delay }: {
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
}) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className={`reveal reveal-delay-${delay} group`}>
      <div onClick={() => navigate('/products')} className="rounded-[20px] overflow-hidden cursor-pointer bg-warm-white transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-charcoal/10">
        <div className="relative aspect-square overflow-hidden flex items-center justify-center">
          <div className={`w-full h-full flex items-center justify-center text-[72px] transition-transform duration-500 ease-out group-hover:scale-108 bg-gradient-to-br ${bgColor}`}>
            {icon}
          </div>
          {badge && (
            <span className={`absolute top-3.5 left-3.5 text-xs tracking-widest uppercase px-3 py-1 rounded-full font-medium z-10 ${badgeType === 'new' ? 'bg-sage-dark' : 'bg-clay'} text-white`}>
              {badge}
            </span>
          )}
          <button 
            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-115 hover:bg-white"
            onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
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
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < rating ? 'text-gold' : 'text-gray-300'}`}>★</span>
                ))}
                <span className="text-xs text-muted ml-1">({reviews.toLocaleString()})</span>
              </div>
              <div className="text-lg font-medium text-clay mt-1">{price}</div>
            </div>
            <button 
              className="w-9 h-9 rounded-full border-none cursor-pointer text-white text-lg font-light flex items-center justify-center transition-all duration-300 hover:bg-[#b56a49] hover:scale-110"
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              style={{ background: isAdded ? '#5C7A57' : '#C97B5A' }}
            >
              {isAdded ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Best Sellers Section
function BestSellers() {
  const navigate = useNavigate();
  const products = [
    { badge: 'Bestseller', badgeType: 'bestseller' as const, bgColor: 'from-[#FDE8E0] to-[#F2C4B2]', icon: '🍼', name: 'Bloom Glass Bottle', sub: 'Anti-colic · 4oz & 8oz', price: '$28.00', rating: 5, reviews: 2841, delay: 1 },
    { badge: 'New', badgeType: 'new' as const, bgColor: 'from-[#E0EDD8] to-[#C5DFC0]', icon: '🌿', name: 'Cloud Organic Swaddle', sub: '100% GOTS Certified Cotton', price: '$42.00', rating: 5, reviews: 1203, delay: 2 },
    { badge: 'Top Rated', badgeType: 'toprated' as const, bgColor: 'from-[#E8E0F0] to-[#D4C8E8]', icon: '🌙', name: 'Luna Sound Machine', sub: '30 Soothing Sounds · Auto-off', price: '$54.00', rating: 5, reviews: 3102, delay: 3 },
    { bgColor: 'from-[#FFF3D4] to-[#FFE4A0]', icon: '🧸', name: 'Honey Bear Plush Set', sub: 'Hypoallergenic · Safe for Newborns', price: '$36.00', rating: 4, reviews: 876, delay: 4 },
  ];

  return (
    <section className="py-24 px-12 bg-cream relative" id="bestsellers">
      {/* Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-clay opacity-30" style={{ top: '15%', right: '10%' }}>✦</div>
        <div className="absolute text-clay opacity-30 text-xl" style={{ bottom: '20%', left: '5%' }}>✧</div>
        <div className="absolute text-8xl opacity-8" style={{ bottom: '10%', right: '20%' }}>☁️</div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="reveal">
              <div className="flex items-center gap-3 text-clay text-xs tracking-[0.35em] uppercase font-medium mb-3">
                <span className="w-7 h-px bg-clay"></span>
                Best Sellers
              </div>
            </div>
            <h2 className="font-display text-[clamp(36px,5vw,62px)] font-light leading-tight text-charcoal reveal">
              Loved by<br /><em className="italic text-sage-dark">thousands</em> of families
            </h2>
          </div>
          <a href="#" className="reveal text-xs tracking-widest uppercase text-clay no-underline border-b border-current pb-0.5 transition-opacity duration-200 hover:opacity-60">View All Products →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Promise Section
function Promise() {
  const stats = [
    { num: '50K+', label: 'Happy Families' },
    { num: '100%', label: 'Organic' },
    { num: '4.9★', label: 'Avg. Rating' },
  ];

  const promises = [
    { icon: '🌱', title: 'Naturally Safe', desc: 'Free from harsh chemicals. All materials are GOTS certified and pediatrician approved.' },
    { icon: '🛡️', title: 'Rigorously Tested', desc: 'Every product passes 200+ safety checks before it ever reaches your little one.' },
    { icon: '♻️', title: 'Sustainably Made', desc: 'Carbon-neutral operations with packaging made from 100% recycled materials.' },
    { icon: '💛', title: 'Expert Backed', desc: 'Designed in collaboration with pediatricians, lactation consultants, and parents.' },
  ];

  return (
    <section className="py-24 px-12 bg-charcoal text-cream relative overflow-hidden" id="promise">
      <div className="absolute inset-0 flex items-center justify-center font-display text-[clamp(100px,18vw,220px)] font-light text-white/[0.03] tracking-tight leading-none pointer-events-none select-none">
        Lumi
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="reveal">
          <div className="flex items-center gap-3 text-blush text-xs tracking-[0.35em] uppercase font-medium mb-3">
            <span className="w-7 h-px bg-blush"></span>
            Our Promise
          </div>
          <h2 className="font-display text-[clamp(36px,5vw,62px)] font-light leading-tight text-cream mb-5">
            Made for <em className="italic text-blush">moments</em><br />that matter most
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-10">
            Every product in our collection is thoughtfully designed, rigorously tested, and made with the purest ingredients. Because your baby deserves nothing but the best.
          </p>
          <div className="flex gap-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-display text-5xl font-light text-blush leading-none">{stat.num}</div>
                <div className="text-xs text-white/50 tracking-widest uppercase mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 reveal">
          {promises.map((item, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-4xl p-7 transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1">
              <div className="text-[28px] mb-3.5">{item.icon}</div>
              <h4 className="font-display text-xl font-normal text-cream mb-2">{item.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const reviews = [
    { text: '"The Bloom bottle completely solved our baby\'s colic. I wish we\'d found Lumi sooner — absolute game-changer for our whole family."', author: 'Sarah M.', role: 'Mother of 2 · Verified Purchase', avatar: '👩', color: 'from-blush to-clay' },
    { text: '"Luna Sound Machine is a miracle. Our daughter went from waking every 2 hours to sleeping 8 hours straight after just three days."', author: 'James & Elena K.', role: 'New Parents · Verified Purchase', avatar: '👨', color: 'from-sky to-sage' },
    { text: '"The organic swaddles are impossibly soft. My sensitive-skinned baby has had zero rashes since we switched. Worth every penny."', author: 'Priya R.', role: 'Mom of 3 · Verified Purchase', avatar: '👩', color: 'from-lavender to-purple-400' },
    { text: '"Customer service is phenomenal. They replaced a defective monitor with zero hassle. The product quality is stunning too."', author: 'Marco T.', role: 'First-time Dad · Verified Purchase', avatar: '🧑', color: 'from-[#FDE8E0] to-[#F2C4B2]' },
    { text: '"I\'ve bought for all three of my kids from Lumi. The consistency in quality is unmatched. They\'ve earned a customer for life."', author: 'Diane L.', role: 'Mother of 3 · Verified Purchase', avatar: '👩', color: 'from-[#E0EDD8] to-[#C5DFC0]' },
  ];

  return (
    <section className="py-24 px-12 bg-warm-white relative overflow-hidden" id="testimonials">
      {/* Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute text-clay opacity-30" style={{ top: '10%', left: '10%' }}>✦</div>
        <div className="absolute text-clay opacity-30 text-lg" style={{ bottom: '15%', right: '10%' }}>✧</div>
        <div className="absolute text-7xl opacity-10" style={{ top: '20%', right: '5%' }}>☁️</div>
      </div>

      <div className="text-center mb-16 reveal">
        <div className="flex items-center justify-center gap-3 text-clay text-xs tracking-[0.35em] uppercase font-medium mb-3">
          Testimonials
        </div>
        <h2 className="font-display text-[clamp(36px,5vw,62px)] font-light leading-tight text-charcoal">
          Parents <em className="italic text-sage-dark">adore</em> us
        </h2>
        <p className="text-muted text-base mt-3">Over 50,000 five-star reviews from real families</p>
      </div>

      <div className="overflow-hidden relative">
        <div className="absolute top-0 bottom-0 w-20 z-20 pointer-events-none" style={{ left: 0, background: 'linear-gradient(to right, #FFFAF5, transparent)' }}></div>
        <div className="absolute top-0 bottom-0 w-20 z-20 pointer-events-none" style={{ right: 0, background: 'linear-gradient(to left, #FFFAF5, transparent)' }}></div>
        
        <div className="flex gap-6 w-max animate-review-scroll hover:animation-paused">
          {[...reviews, ...reviews].map((review, i) => (
            <div key={i} className="w-[360px] flex-shrink-0 bg-cream rounded-[20px] p-8 border border-clay/10 transition-shadow duration-300 hover:shadow-charcoal/8">
              <div className="flex gap-0.5 mb-4 text-gold">
                {[...Array(5)].map((_, j) => <span key={j} className="text-sm">★</span>)}
              </div>
              <p className="font-display text-lg font-normal leading-relaxed text-charcoal mb-6 italic">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base bg-gradient-to-br ${review.color}`}>
                  {review.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">{review.author}</div>
                  <div className="text-xs text-muted">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Blog Section
function Blog() {
  const blogs = [
    { tag: 'Sleep', date: 'March 2, 2025', title: 'The Complete Guide to Newborn Sleep: What No One Tells You', excerpt: 'Understanding your baby\'s sleep cycles is the first step to a well-rested household.', icon: '🌙', bg: 'from-[#E8F4F0] to-[#C0DDD5]', size: 'text-8xl', col: 'col-span-1 lg:col-span-2' },
    { tag: 'Feeding', date: 'Feb 20, 2025', title: 'Breastfeeding vs. Formula: An Evidence-Based Guide', excerpt: 'Making an informed feeding decision without the guilt.', icon: '🍼', bg: 'from-[#FDE8E0] to-[#F0C4B0]', size: 'text-6xl', col: 'col-span-1' },
    { tag: 'Nursery', date: 'Feb 14, 2025', title: '10 Nursery Must-Haves for 2025', excerpt: 'Curated picks from our design team for a safe, beautiful nursery.', icon: '🌱', bg: 'from-[#EDE8F8] to-[#D4C8E8]', size: 'text-6xl', col: 'col-span-1' },
  ];

  return (
    <section className="py-24 px-12 bg-cream" id="blog">
      <div className="flex justify-between items-end mb-14">
        <div>
          <div className="reveal">
            <div className="flex items-center gap-3 text-clay text-xs tracking-[0.35em] uppercase font-medium mb-3">
              <span className="w-7 h-px bg-clay"></span>
              Guides & Insights
            </div>
          </div>
          <h2 className="font-display text-[clamp(36px,5vw,62px)] font-light leading-tight text-charcoal reveal">
            From our <em className="italic text-sage-dark">journal</em>
          </h2>
        </div>
        <a href="#" className="reveal text-xs tracking-widest uppercase text-clay no-underline border-b border-current pb-0.5 transition-opacity duration-200 hover:opacity-60">All Articles →</a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {blogs.map((blog, i) => (
          <div key={i} className={`reveal ${i === 0 ? 'reveal-delay-1' : `reveal-delay-${(i % 3) + 1}`}`}>
            <div className="rounded-[20px] overflow-hidden cursor-pointer bg-warm-white transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5">
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className={`w-full h-full flex items-center justify-center ${blog.bg} transition-transform duration-500 ease-out hover:scale-106 ${blog.size}`}>
                  {blog.icon}
                </div>
                <span className="absolute bottom-3.5 left-3.5 bg-white text-clay text-xs tracking-widest uppercase px-3 py-1 rounded-full font-medium">{blog.tag}</span>
              </div>
              <div className="p-6">
                <div className="text-xs text-muted tracking-wider mb-2.5">{blog.date}</div>
                <h3 className={`font-display font-normal text-charcoal leading-snug mb-3 ${i === 0 ? 'text-2xl' : 'text-xl'}`}>{blog.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{blog.excerpt}</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-clay no-underline border-b border-current pb-0.5">Read Article →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Newsletter Section
function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 px-12 bg-gradient-to-br from-sage to-sage-dark text-center relative overflow-hidden">
      <span className="absolute text-[300px] opacity-4 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif pointer-events-none">✦</span>
      <div className="relative z-10 reveal">
        <h2 className="font-display text-[clamp(36px,4vw,54px)] font-light text-white mb-3.5">
          Join the <em className="italic">Lumi</em> family
        </h2>
        <p className="text-white/75 text-base mb-10">Get parenting tips, exclusive offers, and new arrival alerts straight to your inbox.</p>
        <div className="flex gap-3 justify-center max-w-[480px] mx-auto">
          <input 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full border-none bg-white/90 font-body text-sm outline-none text-charcoal placeholder:text-muted"
          />
          <button 
            onClick={handleSubscribe}
            className="px-8 py-4 rounded-full border-none bg-clay text-white cursor-pointer font-body text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:bg-[#b56a49] hover:scale-103"
            style={{ background: isSubscribed ? '#5C7A57' : '#C97B5A' }}
          >
            {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ==================== MAIN HOMEPAGE COMPONENT ====================

export default function Homepage() {
  const { cursorRef, followerRef } = useCustomCursor();
  useScrollReveal();

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="cursor"></div>
      <div ref={followerRef} className="cursor-follower"></div>

      {/* Hero Section */}
      <Hero />

      {/* Ticker */}
      <Ticker />

      {/* Categories */}
      <Categories />

      {/* Best Sellers */}
      <BestSellers />

      {/* Promise */}
      <Promise />

      {/* Testimonials */}
      <Testimonials />

      {/* Blog */}
      <Blog />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}

