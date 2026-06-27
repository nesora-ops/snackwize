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
  // Selectable flavours (empty for single-variant items).
  flavours?: string[];
};

export const PRODUCTS: Product[] = [
  { id: "swaad-fit-mathri",       name: "Swaad Fit Mathri",            category: "Mathri",       description: "Crispy, healthy, all-time favourite.",        price: 130, net_weight_grams: 100, image: "/Swaad fit mathri.png",          flavours: ['Black Pepper', 'Hot n Spicy', 'Classic', 'Traditional Sweet'] },
  { id: "beet-drop-mathri",       name: "Beet Drop Mathri",            category: "Mathri",       description: "Beetroot mathri — baked, bold, beautiful.",   price: 130, net_weight_grams: 100, image: "/Beet drop mathri.png",          badge: "NEW" },
  { id: "cheese-tease-stix",      name: "Cheese Tease Stix",           category: "Crispies",     description: "Cheesy crunch that you can't resist.",        price: 130, net_weight_grams: 100, image: "https://placehold.co/800x600/png?text=Cheese+Tease+Stix", badge: "NEW" },
  { id: "nachni-ninjas",          name: "Nachni Ninjas!",              category: "Crispies",     description: "Guilt-free ragi bites. Crunch king.",         price: 130, net_weight_grams: 100, image: "/Nachni Ninjas.png",            flavours: ['Garlic Sesame', 'Chilli Garlic', 'Peri Peri', 'Onion Sesame'] },
  { id: "jowar-jhatka",           name: "Jowar Jhatka",                category: "Crispies",     description: "Airy crisp, pure grain, mindful munch.",      price: 130, net_weight_grams: 100, image: "/Jowar Jhatka.jpg",             flavours: ['Spicy Garlic', 'Italian', 'Mexican', 'Peri Peri', 'Onion Sesame'] },
  { id: "the-wheat-fix",          name: "The Wheat Fix",               category: "Crispies",     description: "Golden wheat crunch, all-day snack.",         price: 130, net_weight_grams: 100, image: "/The Wheat Fix.png",            flavours: ['Onion Sesame', 'Schezwan', 'Peri Peri'] },
  { id: "makhana-madness",        name: "Makhana Madness",             category: "Bhel & Mixes", description: "Fluffy foxnut bhel mix.",                     price: 1800,net_weight_grams: 1000,image: "/Makhana madness.jpg" },
  { id: "roasty-bhel",            name: "Roasty Bhel",                 category: "Bhel & Mixes", description: "Craving queen, easy snacking.",               price: 550, net_weight_grams: 1000,image: "/ROASTY BHEL.webp" },
  { id: "almond-cranberry-oat-cake",name: "Almond Cranberry Oat Cake",  category: "Bakes",        description: "No sugar, no butter, no maida.",             price: 650, net_weight_grams: 250, image: "/ALMOND CRANBERRY OAT CAKE.jpg",badge: "NEW" },
  { id: "meethi-mathri",          name: "Meethi Mathri",               category: "Mathri",       description: "Sweet festive mathri, jaggery-kissed.",       price: 130, net_weight_grams: 100, image: "/Meethi Mathri.jpg" },
  { id: "beet-it-crunch",         name: "Beet it Crunch",              category: "Crispies",     description: "Baked, bold, beetroot goodness.",             price: 150, net_weight_grams: 100, image: "/Beet it crunch.png",           badge: "NEW" },
  { id: "thecha-curlies",         name: "Thecha Curlies",              category: "Crispies",     description: "Fiery Maharashtrian thecha meets baked curls.",price: 120, net_weight_grams: 120, image: "/Thecha Curlies .jpg" },
  { id: "oats-bhel-blast",        name: "Oats Bhel Blast",             category: "Bhel & Mixes", description: "All healthy grains, masala-packed.",          price: 130, net_weight_grams: 100, image: "/OATS BHEL BLAST.jpg" },
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
export const FACEBOOK = "https://www.facebook.com/Snackwize/";
export const PHONE = "+91 99306 00993";