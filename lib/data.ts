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
  delivery_type?: 'domestic' | 'hyperlocal';
  // Availability flags (DB-backed products).
  in_stock?: boolean;
  allow_backorder?: boolean;
  hyperlocal_cutoff?: boolean;
  // Selectable flavours (empty for single-variant items).
  flavours?: string[];
  // Link to the Instagram reel behind this product, when there is one.
  instagram_url?: string;
};

export const PRODUCTS: Product[] = [
  { id: "swaad-fit-mathri",       name: "Swaad Fit Mathri",            category: "Mathri",       description: "Crispy, healthy, all-time favourite.",        price: 145, net_weight_grams: 100, image: "/Swaad fit mathri.png",          flavours: ['Black Pepper', 'Hot n Spicy', 'Classic', 'Traditional Sweet'] },
  { id: "beet-drop-mathri",       name: "Beet Drop Mathri",            category: "Mathri",       description: "Beetroot mathri — baked, bold, beautiful.",   price: 145, net_weight_grams: 100, image: "/Beet drop mathri.png",          badge: "NEW" },
  { id: "cheese-tease-stix",      name: "Cheese Tease Stix",           category: "Crispies",     description: "Cheesy crunch that you can't resist.",        price: 210, net_weight_grams: 100, image: "/cheese_tease_item.png",                              badge: "NEW", instagram_url: "https://www.instagram.com/snackwize_/reel/DBdTOoRyzOB/" },
  { id: "nachni-ninjas",          name: "Nachni Ninjas!",              category: "Crispies",     description: "Guilt-free ragi bites. Crunch king.",         price: 145, net_weight_grams: 100, image: "/Nachni Ninjas.png",            flavours: ['Garlic Sesame', 'Chilli Garlic', 'Peri Peri', 'Onion Sesame'] },
  { id: "jowar-jhatka",           name: "Jowar Jhatka",                category: "Crispies",     description: "Airy crisp, pure grain, mindful munch.",      price: 145, net_weight_grams: 100, image: "/Jowar Jhatka.jpg",             flavours: ['Spicy Garlic', 'Italian', 'Mexican', 'Peri Peri', 'Onion Sesame'], instagram_url: "https://www.instagram.com/snackwize_/reel/DX86dKhIunT/" },
  { id: "the-wheat-fix",          name: "The Wheat Fix",               category: "Crispies",     description: "Golden wheat crunch, all-day snack.",         price: 145, net_weight_grams: 100, image: "/The Wheat Fix.png",            flavours: ['Onion Sesame', 'Schezwan', 'Peri Peri'] },
  { id: "makhana-madness",        name: "Makhana Madness",             category: "Bhel & Mixes", description: "Fluffy foxnut bhel mix.",                     price: 1980,net_weight_grams: 1000,image: "/Makhana madness.jpg" },
  { id: "roasty-bhel",            name: "Roasty Bhel",                 category: "Bhel & Mixes", description: "Craving queen, easy snacking.",               price: 600, net_weight_grams: 1000,image: "/ROASTY BHEL.webp" },
  { id: "almond-cranberry-oat-cake",name: "Almond Cranberry Oat Cake",  category: "Bakes",        description: "No sugar, no butter, no maida.",             price: 715, net_weight_grams: 250, image: "/ALMOND CRANBERRY OAT CAKE.jpg",badge: "NEW", instagram_url: "https://www.instagram.com/snackwize_/reel/DV3GhDWkZEE/" },
  { id: "meethi-mathri",          name: "Meethi Mathri",               category: "Mathri",       description: "Sweet festive mathri, jaggery-kissed.",       price: 165, net_weight_grams: 100, image: "/Meethi Mathri.jpg",            instagram_url: "https://www.instagram.com/snackwize_/reel/DUP0VfckVmw/" },
  { id: "beet-it-crunch",         name: "Beet it Crunch",              category: "Crispies",     description: "Baked, bold, beetroot goodness.",             price: 165, net_weight_grams: 100, image: "/Beet it crunch.png",           badge: "NEW" },
  { id: "thecha-curlies",         name: "Thecha Curlies",              category: "Crispies",     description: "Fiery Maharashtrian thecha meets baked curls.",price: 165, net_weight_grams: 120, image: "/Thecha Curlies .jpg",          instagram_url: "https://www.instagram.com/snackwize_/reel/DXqx9GuiGKW/" },
  { id: "oats-bhel-blast",        name: "Oats Bhel Blast",             category: "Bhel & Mixes", description: "All healthy grains, masala-packed.",          price: 145, net_weight_grams: 100, image: "/OATS BHEL BLAST.jpg" },
  { id: "coc-remix",              name: "COC Remix",                   category: "Crispies",     description: "A remixed crunch, freshly baked.",            price: 145, net_weight_grams: 100, image: "" },
  { id: "bajre-da-sitta",         name: "Bajre Da Sitta",              category: "Crispies",     description: "Pearl millet, roasted rustic and hearty.",    price: 165, net_weight_grams: 100, image: "" },
];

export const CATEGORIES = [
  "All",
  "Mathri",
  "Crispies",
  "Bhel & Mixes",
  "Bakes",
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
// Instagram highlight of customer messages and unboxings, linked from About.
export const CLIENT_STORIES = "https://www.instagram.com/stories/highlights/18155668120117900/";
export const FACEBOOK = "https://www.facebook.com/Snackwize/";
export const PHONE = "+91 99306 00993";