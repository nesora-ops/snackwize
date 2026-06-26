export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  // Legacy free-text weight (static marketing menu only).
  weight?: string;
  // New-drop product attributes (DB-backed products).
  net_weight_grams?: number;
  shelf_life?: string;
  nutrition?: string;
  delivery_type?: 'local' | 'hyperlocal';
  // Availability flags (DB-backed products).
  in_stock?: boolean;
  allow_backorder?: boolean;
};

const img = (q: string, i = 1) =>
  `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=800&q=80&sig=${i}`;

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Choco Almond Granola Bar", category: "Granola Bars", description: "Dark cocoa, roasted almonds, jaggery-bound oats.", weight: "120g", price: 120, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80", badge: "Bestseller" },
  { id: "p2", name: "Oats & Raisin Cookies", category: "Cookies", description: "Chewy oat cookies with golden raisins. 6 pieces.", weight: "180g", price: 180, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80" },
  { id: "p3", name: "Peanut Butter Energy Bites", category: "Energy Bites", description: "No-bake bites of peanut butter, oats & dates.", weight: "150g", price: 150, image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80" },
  { id: "p4", name: "Banana Walnut Muffins", category: "Muffins", description: "Ripe banana, toasted walnut, whole-wheat. 4 pcs.", weight: "260g", price: 220, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80" },
  { id: "p5", name: "Trail Mix Jar", category: "Trail Mix", description: "Almonds, cashews, pumpkin seeds, cranberries.", weight: "250g", price: 280, image: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&q=80" },
  { id: "p6", name: "Date & Nut Bar", category: "Energy Bites", description: "Medjool dates, almonds, pistachios. 4 pcs.", weight: "160g", price: 160, image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=800&q=80" },
  { id: "p7", name: "Coconut Jaggery Cookies", category: "Cookies", description: "Crisp coconut cookies sweetened with jaggery.", weight: "170g", price: 170, image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=800&q=80" },
  { id: "p8", name: "Mango Granola Clusters", category: "Granola Bars", description: "Sun-dried mango clusters, baked oat crunch.", weight: "200g", price: 200, image: "https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?auto=format&fit=crop&w=800&q=80", badge: "Seasonal" },
  { id: "p9", name: "Multigrain Crackers", category: "Seasonal Specials", description: "Five-grain savoury crackers, lightly salted.", weight: "130g", price: 130, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80" },
  { id: "p10", name: "Almond Flax Ladoo", category: "Energy Bites", description: "Traditional ladoo with almond meal & flax. 6 pcs.", weight: "180g", price: 190, image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80" },
  { id: "p11", name: "Baked Mathri", category: "Seasonal Specials", description: "Crisp baked mathri — not fried, all the crunch.", weight: "100g", price: 110, image: "https://images.unsplash.com/photo-1606755962773-d324e1a4f5b6?auto=format&fit=crop&w=800&q=80" },
  { id: "p12", name: "Seasonal Dry Fruit Mix", category: "Trail Mix", description: "Premium dry fruit blend, hand-packed jar.", weight: "300g", price: 350, image: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&q=80", badge: "Premium" },
];

export const CATEGORIES = [
  "All",
  "Granola Bars",
  "Cookies",
  "Energy Bites",
  "Muffins",
  "Trail Mix",
  "Seasonal Specials",
] as const;

export type Testimonial = { name: string; city: string; rating: number; text: string };

export const TESTIMONIALS: Testimonial[] = [
  { name: "Aarti S.", city: "Mumbai", rating: 5, text: "The granola bars are my morning ritual now. Tastes homemade because it IS homemade." },
  { name: "Rohan M.", city: "Bengaluru", rating: 5, text: "Finally a snack brand I trust for my kids. No preservatives, all flavor." },
  { name: "Priya K.", city: "Delhi", rating: 5, text: "Packed beautifully, arrived all the way to Delhi in perfect condition." },
  { name: "Karan D.", city: "Pune", rating: 4, text: "The peanut butter bites are dangerously good. Ordered 3 jars already." },
  { name: "Sneha R.", city: "Hyderabad", rating: 5, text: "Love that they're baked not fried. The mathri is a revelation." },
  { name: "Ishaan P.", city: "Mumbai", rating: 5, text: "Nupur's attention to detail is incredible. Feels like a gift every time." },
  { name: "Meera T.", city: "Chennai", rating: 5, text: "Trail mix is honest, generous and absolutely fresh. Will reorder." },
  { name: "Vikram A.", city: "Gurugram", rating: 4, text: "Cookies have that perfect chew. My office stash never lasts a week." },
  { name: "Anita B.", city: "Kolkata", rating: 5, text: "Date & nut bars travel well — perfect for my work commute." },
  { name: "Ravi N.", city: "Ahmedabad", rating: 5, text: "The almond flax ladoos remind me of home. Beautifully done." },
  { name: "Tara J.", city: "Jaipur", rating: 5, text: "Muffins arrived soft and fresh. Honest baking, real ingredients." },
  { name: "Sahil G.", city: "Mumbai", rating: 5, text: "Customer service is top-tier. Nupur personally followed up. Loved it." },
];

export type DemoOrder = {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: number;
  date: string;
  status: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
};

export const DEMO_ORDERS: DemoOrder[] = [];

export const DEMO_CUSTOMERS: any[] = [];

export const WHATSAPP = "https://wa.me/919930600993";
export const INSTAGRAM = "https://instagram.com/snackwize_";
export const FACEBOOK = "https://www.facebook.com/Snackwize/";
export const PHONE = "+91 99306 00993";