// All editable copy and contact details live here, so the site can be
// updated (or translated) without touching the page layouts.

export const company = {
  name: "Isla Prime",
  legalName: "Isla Prime Property Management Supply Co.",
  tagline: "Hotel & Short-Term Rental Supply",
  location: "Puerto Rico",
  // TODO: replace with the real contact details.
  email: "hello@islaprimesupply.com",
  phone: "(787) 000-0000",
  hours: "Mon – Fri · 8:00 AM – 5:00 PM AST",
};

export const nav = [
  { href: "/collections", label: "Collections" },
  { href: "/#industries", label: "Who We Serve" },
  { href: "/#process", label: "How It Works" },
  { href: "/about", label: "About" },
];

export type CollectionIconName =
  | "towel"
  | "bed"
  | "amenity"
  | "housekeeping"
  | "room"
  | "kitchen";

export type Collection = {
  slug: string;
  name: string;
  icon: CollectionIconName;
  description: string;
  items: string[];
  tone: string;
};

export const collections: Collection[] = [
  {
    slug: "bath",
    name: "Bath Linens",
    icon: "towel",
    description: "Plush, absorbent and built to survive commercial laundering.",
    items: ["Bath & hand towels", "Washcloths", "Bath mats", "Pool & beach towels", "Robes"],
    tone: "bg-linen",
  },
  {
    slug: "bed",
    name: "Bed Linens",
    icon: "bed",
    description: "Crisp, hotel-finish bedding for a five-star first impression.",
    items: ["Sheet sets", "Duvet covers & inserts", "Pillows & protectors", "Mattress pads", "Throws"],
    tone: "bg-sand-100",
  },
  {
    slug: "amenities",
    name: "Guest Amenities",
    icon: "amenity",
    description: "Thoughtful in-room touches that guests remember and review.",
    items: ["Bath toiletries", "Dispensers & refills", "Slippers", "Vanity kits", "Welcome items"],
    tone: "bg-mist",
  },
  {
    slug: "room",
    name: "Room Essentials",
    icon: "room",
    description: "The finishing pieces that make a room feel complete.",
    items: ["Hangers", "Hair dryers", "Luggage racks", "Waste bins", "Blackout solutions"],
    tone: "bg-linen",
  },
  {
    slug: "kitchen",
    name: "Kitchen & Dining",
    icon: "kitchen",
    description: "Everything a fully stocked rental kitchen should have.",
    items: ["Dinnerware & glassware", "Coffee service", "Cookware sets", "Kitchen linens", "Starter packs"],
    tone: "bg-sand-100",
  },
  {
    slug: "housekeeping",
    name: "Housekeeping",
    icon: "housekeeping",
    description: "Reliable supplies that keep turnovers fast and consistent.",
    items: ["Cleaning supplies", "Laundry essentials", "Paper goods", "Trash liners", "Carts & caddies"],
    tone: "bg-mist",
  },
];

export const pillars = [
  {
    title: "Hotel-grade quality",
    body: "Textiles and amenities selected to hospitality standards — soft for the guest, durable for the laundry room.",
  },
  {
    title: "Island-based supply",
    body: "Stock and service based here in Puerto Rico, so you aren't waiting on mainland shipping when it matters.",
  },
  {
    title: "Wholesale pricing",
    body: "Volume pricing for hotels, rental portfolios and property managers — whether you run five units or five hundred.",
  },
  {
    title: "Restock programs",
    body: "Recurring orders built around your occupancy, so linen closets never run short on a busy weekend.",
  },
];

export const industries = [
  {
    eyebrow: "01",
    title: "Hotels & Resorts",
    body: "Consistent, high-volume supply for properties where every room needs to feel the same: flawless.",
    points: ["Bulk linen programs", "Branded amenity options", "Scheduled deliveries"],
  },
  {
    eyebrow: "02",
    title: "Short-Term Rentals",
    body: "Help your Airbnb or VRBO listing earn five-star reviews with a stay that feels like a boutique hotel.",
    points: ["Complete unit setup kits", "Guest-ready amenity bundles", "Turnover restocks"],
  },
  {
    eyebrow: "03",
    title: "Property Managers",
    body: "One reliable partner for every property in your portfolio, with standards that scale as you grow.",
    points: ["Portfolio-wide pricing", "Standardized room packages", "Dedicated account support"],
  },
];

export const steps = [
  {
    title: "Tell us about your property",
    body: "Share your property type, number of rooms or units, and what you need to stock.",
  },
  {
    title: "Receive a tailored proposal",
    body: "We put together a curated selection and wholesale quote that fits your standards and budget.",
  },
  {
    title: "Delivered & restocked",
    body: "Your order arrives ready to use — and we can set up recurring restocks so you never run low.",
  },
];

export const propertyTypes = [
  "Hotel / Resort",
  "Boutique hotel / Inn",
  "Short-term rental (Airbnb, VRBO)",
  "Property management company",
  "Other",
];
