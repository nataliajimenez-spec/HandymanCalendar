// All editable copy and contact details live here, so the site can be
// updated (or translated) without touching the page layouts.

export const company = {
  name: "Isla Prime",
  legalName: "Isla Prime Property Management Supply Co.",
  tagline: "Hotel & short-term rental supplies",
  location: "Puerto Rico",
  // TODO: replace with the real contact details.
  email: "hello@islaprimesupply.com",
  phone: "(787) 000-0000",
  hours: "Monday to Friday, 8:00 AM – 5:00 PM",
};

// Main links, shown in the header on desktop and in the side menu.
export const nav = [
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About us" },
  { href: "/about#contact", label: "Contact" },
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
  tint: string;
};

export const collections: Collection[] = [
  {
    slug: "bath",
    name: "Bath Linens",
    icon: "towel",
    description: "Soft, absorbent towels that hold up wash after wash.",
    items: ["Bath & hand towels", "Washcloths", "Bath mats", "Pool & beach towels", "Robes"],
    tint: "bg-sea-light text-sea",
  },
  {
    slug: "bed",
    name: "Bed Linens",
    icon: "bed",
    description: "Crisp sheets and comfy pillows for a hotel-style bed.",
    items: ["Sheet sets", "Duvet covers & inserts", "Pillows & protectors", "Mattress pads", "Throws"],
    tint: "bg-sun-light text-[#b5761c]",
  },
  {
    slug: "amenities",
    name: "Guest Amenities",
    icon: "amenity",
    description: "Little extras that guests love and mention in reviews.",
    items: ["Bath toiletries", "Dispensers & refills", "Slippers", "Vanity kits", "Welcome items"],
    tint: "bg-shell text-[#9a7a4a]",
  },
  {
    slug: "room",
    name: "Room Essentials",
    icon: "room",
    description: "The everyday pieces that make a room feel ready.",
    items: ["Hangers", "Hair dryers", "Luggage racks", "Waste bins", "Blackout solutions"],
    tint: "bg-sea-light text-sea",
  },
  {
    slug: "kitchen",
    name: "Kitchen & Dining",
    icon: "kitchen",
    description: "Everything for a fully stocked rental kitchen.",
    items: ["Dinnerware & glassware", "Coffee service", "Cookware sets", "Kitchen linens", "Starter packs"],
    tint: "bg-sun-light text-[#b5761c]",
  },
  {
    slug: "housekeeping",
    name: "Housekeeping",
    icon: "housekeeping",
    description: "Supplies that keep every turnover quick and easy.",
    items: ["Cleaning supplies", "Laundry essentials", "Paper goods", "Trash liners", "Carts & caddies"],
    tint: "bg-shell text-[#9a7a4a]",
  },
];

export type BenefitIcon = "tag" | "pin" | "box" | "chat";

export const benefits: { icon: BenefitIcon; title: string; body: string }[] = [
  { icon: "tag", title: "Wholesale prices", body: "Hotel quality without the hotel markup." },
  { icon: "pin", title: "Right here in PR", body: "Local supply, no waiting on mainland shipping." },
  { icon: "box", title: "Any size property", body: "From one Airbnb to a full hotel." },
  { icon: "chat", title: "Free quotes", body: "Tell us what you need. No pressure." },
];

export const audiences = [
  {
    title: "Airbnb & VRBO hosts",
    body: "Give guests that boutique-hotel feeling and earn the five-star reviews that keep your calendar full.",
    points: ["Ready-to-go unit kits", "Guest amenity bundles", "Easy restocks between stays"],
  },
  {
    title: "Property managers",
    body: "One go-to supplier for every unit you manage, with the same quality from the first property to the fiftieth.",
    points: ["Pricing across your portfolio", "Matching setups for every unit", "One contact for all orders"],
  },
  {
    title: "Hotels & guest houses",
    body: "Reliable, consistent supply for every room, so housekeeping always has what it needs.",
    points: ["Bulk linen orders", "Amenity programs", "Scheduled deliveries"],
  },
];

export const steps = [
  { title: "Tell us what you need", body: "Send your list, or tell us about your property and we'll help build one." },
  { title: "Get your quote", body: "We send clear wholesale pricing, usually with a couple of options to choose from." },
  { title: "Receive & restock", body: "Your order arrives ready to use. Reorder anytime, or set up regular restocks." },
];

export const accountPerks = [
  "Reorder your usual items in a few clicks",
  "See your prices and past orders in one place",
  "Save lists for each property you manage",
  "Download invoices whenever you need them",
];

export const propertyTypes = [
  "Short-term rental (Airbnb, VRBO)",
  "Property management company",
  "Hotel / Resort",
  "Boutique hotel / Guest house",
  "Other",
];

// Starter list planner. Quantities follow the usual hospitality "par 3":
// one set in use, one in the laundry, one on the shelf.
export type StarterItem = { name: string; per: "bed" | "bath" | "guest"; qty: number };

export const starterItems: StarterItem[] = [
  { name: "Sheet sets", per: "bed", qty: 3 },
  { name: "Duvet covers", per: "bed", qty: 3 },
  { name: "Pillows", per: "bed", qty: 2 },
  { name: "Pillow protectors", per: "bed", qty: 2 },
  { name: "Bath towels", per: "guest", qty: 3 },
  { name: "Washcloths", per: "guest", qty: 3 },
  { name: "Hand towels", per: "bath", qty: 3 },
  { name: "Bath mats", per: "bath", qty: 3 },
  { name: "Beach towels", per: "guest", qty: 1 },
];
