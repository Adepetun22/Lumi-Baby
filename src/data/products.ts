export interface Product {
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
  variant?: string; // display string for cart e.g. "8oz · 2-Pack"
}

export const ALL_PRODUCTS: Product[] = [
  { id: 1,  name: 'Bloom Glass Bottle',      cat: 'Feeding',    desc: 'Anti-colic design with flow-control nipple. Perfect from newborn.',                    emoji: '🍼', bg: 'img-bg-1', price: 28,  oldPrice: null, rating: 4.9, reviews: 2841, badge: 'Bestseller', badgeType: 'sale', variants: ['4oz', '8oz'],              age: '0–3 mo',  brand: 'Lumi Originals', variant: '8oz · 2-Pack' },
  { id: 2,  name: 'Cloud Organic Swaddle',   cat: 'Clothing',   desc: 'GOTS certified cotton blend. Keeps baby cozy and secure all night.',                   emoji: '🌿', bg: 'img-bg-2', price: 42,  oldPrice: null, rating: 4.8, reviews: 1203, badge: 'New',        badgeType: 'new', variants: ['S/M', 'L/XL'],            age: '0–3 mo',  brand: 'NatureBorn',     variant: 'S/M · Sage' },
  { id: 3,  name: 'Luna Sound Machine',      cat: 'Nursery',    desc: '30 soothing sounds, auto-shutoff timer, nightlight included.',                         emoji: '🌙', bg: 'img-bg-3', price: 54,  oldPrice: 68,   rating: 4.9, reviews: 3102, badge: 'Top Rated', badgeType: 'hot', variants: ['White', 'Sage', 'Blush'],  age: 'Newborn', brand: 'Dreamland',      variant: 'Lavender Dream · Standard' },
  { id: 4,  name: 'Honey Bear Plush Set',    cat: 'Toys',       desc: 'Hypoallergenic fill, embroidered eyes, machine washable.',                             emoji: '🧸', bg: 'img-bg-4', price: 36,  oldPrice: 45,   rating: 4.7, reviews: 876,  badge: null,        badgeType: null,  variants: ['Small', 'Medium', 'Large'], age: '3–6 mo',  brand: 'TinyLeaf',       variant: 'Medium' },
  { id: 5,  name: 'AquaFlow Tub',            cat: 'Nursery',    desc: 'Ergonomic baby bath with temperature indicator and non-slip base.',                    emoji: '🛁', bg: 'img-bg-5', price: 48,  oldPrice: null, rating: 4.8, reviews: 654,  badge: 'New',        badgeType: 'new', variants: ['Mint', 'Cream'],           age: 'Newborn', brand: 'SoftCloud',      variant: 'Mint' },
  { id: 6,  name: 'Petal Rattle Set',        cat: 'Toys',       desc: '6-piece sensory rattle set with varied textures and gentle sounds.',                   emoji: '🌸', bg: 'img-bg-6', price: 22,  oldPrice: null, rating: 4.6, reviews: 432,  badge: null,        badgeType: null,  variants: ['Pastel', 'Brights'],       age: '3–6 mo',  brand: 'TinyLeaf',       variant: 'Pastel' },
  { id: 7,  name: 'SilkSoft Burp Cloths',   cat: 'Feeding',    desc: '12-pack. Triple-layer absorbency, stays put on shoulder.',                             emoji: '🌀', bg: 'img-bg-7', price: 32,  oldPrice: 38,   rating: 4.9, reviews: 1876, badge: 'Bestseller', badgeType: 'sale', variants: ['12pk', '6pk'],             age: 'Newborn', brand: 'Lumi Originals', variant: '12pk' },
  { id: 8,  name: 'Star Mobile Projector',   cat: 'Nursery',    desc: '360° rotating projection, 8 music melodies, remote control.',                         emoji: '⭐', bg: 'img-bg-8', price: 72,  oldPrice: 89,   rating: 4.7, reviews: 1243, badge: null,        badgeType: null,  variants: ['White', 'Charcoal'],       age: '0–3 mo',  brand: 'Dreamland',      variant: 'White' },
  { id: 9,  name: 'EcoDry Bamboo Diapers',  cat: 'Diapering',  desc: 'Ultra-soft bamboo layer, zero chemicals, plant-based SAP core.',                      emoji: '🎋', bg: 'img-bg-1', price: 38,  oldPrice: null, rating: 4.8, reviews: 2104, badge: 'New',        badgeType: 'new', variants: ['NB', 'S', 'M', 'L'],      age: 'Newborn', brand: 'NatureBorn',     variant: 'Size M' },
  { id: 10, name: 'Milestone Card Set',      cat: 'Gifts',      desc: '52 beautifully illustrated cards capturing every first moment.',                       emoji: '🎴', bg: 'img-bg-2', price: 18,  oldPrice: null, rating: 4.9, reviews: 987,  badge: null,        badgeType: null,  variants: ['Classic', 'Minimal'],      age: 'Newborn', brand: 'Lumi Originals', variant: 'Classic' },
  { id: 11, name: 'Knit Onesie Bundle',      cat: 'Clothing',   desc: 'Organic merino knit. Expandable neckline, no-scratch seams.',                         emoji: '🧶', bg: 'img-bg-3', price: 58,  oldPrice: 72,   rating: 4.7, reviews: 543,  badge: 'Sale',       badgeType: 'sale', variants: ['0–3m', '3–6m', '6–12m'],  age: '3–6 mo',  brand: 'TinyLeaf',       variant: '3–6m' },
  { id: 12, name: 'Blossom Bottle Warmer',   cat: 'Feeding',    desc: 'Heats evenly in 4 minutes. Compatible with all bottle shapes.',                       emoji: '🌡', bg: 'img-bg-4', price: 44,  oldPrice: null, rating: 4.6, reviews: 765,  badge: null,        badgeType: null,  variants: ['Standard'],               age: '0–3 mo',  brand: 'SoftCloud',      variant: 'Standard' },
  { id: 13, name: 'Forest Friends Play Mat', cat: 'Toys',       desc: 'Reversible, non-toxic foam. 78″ × 59″, with activity arches.',                        emoji: '🌲', bg: 'img-bg-5', price: 96,  oldPrice: 120,  rating: 4.9, reviews: 1567, badge: 'Bestseller', badgeType: 'sale', variants: ['Forest', 'Ocean', 'Desert'],age: 'Newborn', brand: 'NatureBorn',     variant: 'Forest' },
  { id: 14, name: 'Diaper Backpack Pro',     cat: 'Diapering',  desc: '30 pockets, stroller straps, insulated bottle pocket, waterproof.',                   emoji: '🎒', bg: 'img-bg-6', price: 84,  oldPrice: null, rating: 4.8, reviews: 1098, badge: 'New',        badgeType: 'new', variants: ['Sage', 'Clay', 'Charcoal'],age: 'Newborn', brand: 'Lumi Originals', variant: 'Sage' },
  { id: 15, name: 'Sleep Sack Fleece',       cat: 'Clothing',   desc: 'TOG 2.5, 2-way zip, 100% fleece. Keeps legs free to develop.',                        emoji: '💤', bg: 'img-bg-7', price: 52,  oldPrice: 65,   rating: 4.8, reviews: 2300, badge: null,        badgeType: null,  variants: ['S', 'M', 'L'],            age: '6–12 mo', brand: 'Dreamland',      variant: 'M' },
  { id: 16, name: 'Gift Box — New Baby',     cat: 'Gifts',      desc: 'Curated set of 8 bestsellers beautifully wrapped and ribboned.',                      emoji: '🎁', bg: 'img-bg-8', price: 128, oldPrice: 148,  rating: 5.0, reviews: 412,  badge: 'Top Rated', badgeType: 'hot', variants: ['Classic', 'Luxury'],       age: 'Newborn', brand: 'Lumi Originals', variant: 'Classic' },
  { id: 17, name: 'Teething Cactus Toy',     cat: 'Toys',       desc: 'BPA-free silicone, 7 textures, dishwasher safe, easy to grip.',                       emoji: '🌵', bg: 'img-bg-1', price: 14,  oldPrice: null, rating: 4.7, reviews: 1876, badge: null,        badgeType: null,  variants: ['Sage', 'Blush', 'Yellow'], age: '3–6 mo',  brand: 'TinyLeaf',       variant: 'Sage' },
  { id: 18, name: 'Ceramide Baby Lotion',    cat: 'Diapering',  desc: 'Fragrance-free, hypoallergenic. Dermatologist tested for eczema.',                    emoji: '🧴', bg: 'img-bg-2', price: 19,  oldPrice: null, rating: 4.9, reviews: 3204, badge: 'Bestseller', badgeType: 'sale', variants: ['200ml', '400ml'],          age: 'Newborn', brand: 'NatureBorn',     variant: '200ml' },
  { id: 19, name: 'Arch Activity Gym',       cat: 'Toys',       desc: '10 hanging toys, tummy time pillow, foldable for travel.',                            emoji: '🦋', bg: 'img-bg-3', price: 78,  oldPrice: 95,   rating: 4.8, reviews: 987,  badge: 'New',        badgeType: 'new', variants: ['Rainbow', 'Neutral'],      age: 'Newborn', brand: 'SoftCloud',      variant: 'Rainbow' },
  { id: 20, name: 'Memory Book — Year 1',    cat: 'Gifts',      desc: '60-page linen-cover keepsake with guided prompts and pockets.',                       emoji: '📖', bg: 'img-bg-4', price: 46,  oldPrice: null, rating: 4.9, reviews: 1654, badge: null,        badgeType: null,  variants: ['Blush', 'Sage', 'Cream'],  age: 'Newborn', brand: 'Lumi Originals', variant: 'Blush' },
  { id: 21, name: 'Organic Crib Sheet Set',  cat: 'Nursery',    desc: 'Set of 3. OEKO-TEX, 300-thread count sateen. Deep pockets.',                         emoji: '🛏', bg: 'img-bg-5', price: 62,  oldPrice: 78,   rating: 4.8, reviews: 1102, badge: 'Sale',       badgeType: 'sale', variants: ['White', 'Blush', 'Sage'],  age: 'Newborn', brand: 'Dreamland',      variant: 'White' },
  { id: 22, name: 'Stacking Rings Classic',  cat: 'Toys',       desc: '7 oversized rings, non-toxic wood, food-grade paint. Size-sorting.',                  emoji: '🏅', bg: 'img-bg-6', price: 26,  oldPrice: null, rating: 4.7, reviews: 654,  badge: null,        badgeType: null,  variants: ['Natural', 'Pastel'],       age: '6–12 mo', brand: 'TinyLeaf',       variant: 'Natural' },
  { id: 23, name: 'Nesting Cups Set',        cat: 'Toys',       desc: '10-pc. stackable, float in bath. Fine motor skill development.',                      emoji: '🥤', bg: 'img-bg-7', price: 18,  oldPrice: null, rating: 4.6, reviews: 543,  badge: null,        badgeType: null,  variants: ['Rainbow', 'Pastel'],       age: '6–12 mo', brand: 'SoftCloud',      variant: 'Rainbow' },
  { id: 24, name: 'Wearable Baby Monitor',   cat: 'Nursery',    desc: 'Sock-style pulse ox & temp tracker. HD app with sleep insights.',                     emoji: '📡', bg: 'img-bg-8', price: 198, oldPrice: 229,  rating: 4.8, reviews: 2876, badge: 'Top Rated', badgeType: 'hot', variants: ['Size 1 (0–18m)', 'Size 2 (18m+)'], age: 'Newborn', brand: 'NatureBorn', variant: 'Size 1 (0–18m)' },
  { id: 25, name: 'Bamboo Changing Mat',     cat: 'Diapering',  desc: 'Waterproof bamboo cover, memory foam, machine washable.',                             emoji: '🌿', bg: 'img-bg-1', price: 34,  oldPrice: null, rating: 4.7, reviews: 876,  badge: null,        badgeType: null,  variants: ['Natural', 'Cream'],        age: 'Newborn', brand: 'NatureBorn',     variant: 'Natural' },
  { id: 26, name: 'Lovey Security Blanket',  cat: 'Clothing',   desc: 'Silky front, minky back. Personalization option available.',                          emoji: '💛', bg: 'img-bg-2', price: 28,  oldPrice: null, rating: 4.9, reviews: 1432, badge: 'Bestseller', badgeType: 'sale', variants: ['Bear', 'Bunny', 'Elephant'],age: 'Newborn', brand: 'TinyLeaf',       variant: 'Bear' },
  { id: 27, name: 'Wooden Block Set 30pc',   cat: 'Toys',       desc: 'FSC-certified, sanded smooth, solid natural pigment dyes.',                           emoji: '🟫', bg: 'img-bg-3', price: 54,  oldPrice: 68,   rating: 4.8, reviews: 765,  badge: 'Sale',       badgeType: 'sale', variants: ['Natural', 'Painted'],      age: '1–2 yr',  brand: 'TinyLeaf',       variant: 'Natural' },
  { id: 28, name: 'Feeding Pillow Deluxe',   cat: 'Feeding',    desc: 'C-shaped support with removable cover. Fits all nursing positions.',                  emoji: '🤱', bg: 'img-bg-4', price: 68,  oldPrice: null, rating: 4.9, reviews: 2109, badge: 'New',        badgeType: 'new', variants: ['Sage', 'Blush', 'Cream'],  age: 'Newborn', brand: 'SoftCloud',      variant: 'Sage' },
  { id: 29, name: 'Room Temp Nightlight',    cat: 'Nursery',    desc: 'Dual sensor, warm amber glow, auto-off after 15 min.',                                emoji: '🌡', bg: 'img-bg-5', price: 38,  oldPrice: null, rating: 4.6, reviews: 543,  badge: null,        badgeType: null,  variants: ['White', 'Walnut'],         age: 'Newborn', brand: 'Dreamland',      variant: 'White' },
  { id: 30, name: 'Milestone Blanket',       cat: 'Gifts',      desc: 'Stretchy knit with month markers. Great for monthly photos.',                         emoji: '📸', bg: 'img-bg-6', price: 42,  oldPrice: 52,   rating: 4.8, reviews: 987,  badge: null,        badgeType: null,  variants: ['Cream', 'Sage', 'Blush'],  age: 'Newborn', brand: 'Lumi Originals', variant: 'Cream' },
  { id: 31, name: 'First Foods Weaning Set', cat: 'Feeding',    desc: 'Suction bowl, 2 spoons, straw cup, snack pot. All silicone.',                         emoji: '🥣', bg: 'img-bg-7', price: 46,  oldPrice: 58,   rating: 4.9, reviews: 1765, badge: 'Bestseller', badgeType: 'sale', variants: ['Sage', 'Blush', 'Yellow'], age: '6–12 mo', brand: 'Lumi Originals', variant: 'Sage' },
  { id: 32, name: 'Sensory Bin Starter',     cat: 'Toys',       desc: 'Kinetic sand, moulds, tools and storage tray in one box.',                            emoji: '🏖', bg: 'img-bg-8', price: 32,  oldPrice: null, rating: 4.5, reviews: 432,  badge: 'New',        badgeType: 'new', variants: ['Standard'],               age: '2–3 yr',  brand: 'SoftCloud',      variant: 'Standard' },
];

export const getBgGradient = (bg: string): string => {
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
