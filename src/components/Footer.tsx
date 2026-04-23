export default function Footer() {
  const footerLinks = {
    shop: ['Feeding', 'Diapering', 'Nursery', 'Toys', 'Clothing', 'Gift Sets'],
    help: ['My Account', 'Track Order', 'Returns & Exchanges', 'Shipping Info', 'FAQ', 'Contact Us'],
    company: ['Our Story', 'Sustainability', 'Safety Standards', 'Press', 'Affiliates', 'Careers'],
  };

  return (
    <footer className="bg-charcoal text-white/60 py-16 px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="font-display text-2xl font-light text-cream mb-4">
            Lumi<span className="text-blush">✦</span>Baby
          </div>
          <p className="text-sm leading-relaxed mb-6">Premium baby essentials crafted with love. Every product is rigorously tested, sustainably made, and designed to nurture the most magical moments of parenthood.</p>
          <div className="flex gap-3">
            {['📘', '📸', '🐦', '📌'].map((icon, i) => (
              <button key={i} className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.1] flex items-center justify-center text-sm cursor-pointer transition-all duration-300 hover:bg-clay hover:text-white hover:border-clay">
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-cream mb-5 font-medium">Shop</h4>
          {footerLinks.shop.map((link, i) => (
            <a key={i} href="#" className="block text-sm text-white/50 no-underline py-1.5 transition-colors duration-200 hover:text-blush">{link}</a>
          ))}
        </div>

        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-cream mb-5 font-medium">Help</h4>
          {footerLinks.help.map((link, i) => (
            <a key={i} href="#" className="block text-sm text-white/50 no-underline py-1.5 transition-colors duration-200 hover:text-blush">{link}</a>
          ))}
        </div>

        <div>
          <h4 className="font-body text-xs tracking-widest uppercase text-cream mb-5 font-medium">Company</h4>
          {footerLinks.company.map((link, i) => (
            <a key={i} href="#" className="block text-sm text-white/50 no-underline py-1.5 transition-colors duration-200 hover:text-blush">{link}</a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.07] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">© 2026 Lumi Baby. All rights reserved.</p>
        <div>
          <a href="#" className="text-white/40 text-xs no-underline ml-5 hover:text-blush">Privacy Policy</a>
          <a href="#" className="text-white/40 text-xs no-underline ml-5 hover:text-blush">Terms of Service</a>
          <a href="#" className="text-white/40 text-xs no-underline ml-5 hover:text-blush">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}

