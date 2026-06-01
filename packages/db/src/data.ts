export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreCategorySeed = {
  id: number;
  name: string;
  slug: string;
};

export type StoreProductSeed = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  stockQuantity: number;
  active: boolean;
  categorySlug: string;
};

export type StoreUserSeed = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

const viewsByUrlId = new Map<string, number>();

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

export type PurchaseItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
};

export type PurchaseRecord = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  totalAmount: number;
  paymentStatus: string;
  paymentRef: string;
  createdAt: Date;
  items: PurchaseItem[];
};

export const products: Product[] = [
  {
    id: 1,
    sku: "HEADSET-PULSE-01",
    name: "Pulse Wireless Headset",
    description: "Noise-isolating wireless headset with a clear boom microphone.",
    price: 129,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Headset",
    stock: 18,
    active: true,
    createdAt: new Date("Jan 8, 2026"),
    updatedAt: new Date("Jan 8, 2026"),
  },
  {
    id: 2,
    sku: "KEYBOARD-MECH-02",
    name: "Tactile Mechanical Keyboard",
    description: "Compact mechanical keyboard with tactile switches and white backlight.",
    price: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    category: "Keyboard",
    stock: 24,
    active: true,
    createdAt: new Date("Jan 12, 2026"),
    updatedAt: new Date("Jan 12, 2026"),
  },
  {
    id: 3,
    sku: "MOUSE-ERGONOMIC-03",
    name: "Ergo Wireless Mouse",
    description: "Comfort-focused wireless mouse with adjustable DPI and quiet clicks.",
    price: 96,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    category: "Mouse",
    stock: 31,
    active: true,
    createdAt: new Date("Jan 18, 2026"),
    updatedAt: new Date("Jan 18, 2026"),
  },
  {
    id: 4,
    sku: "KEYBOARD-LOWPRO-04",
    name: "Low Profile Keyboard",
    description: "Slim full-size keyboard with quiet keys for office and home setups.",
    price: 44,
    imageUrl:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    category: "Keyboard",
    stock: 40,
    active: true,
    createdAt: new Date("Jan 23, 2026"),
    updatedAt: new Date("Jan 23, 2026"),
  },
  {
    id: 5,
    sku: "MOUSE-GAMING-05",
    name: "Precision Gaming Mouse",
    description: "Lightweight gaming mouse with programmable buttons and fast tracking.",
    price: 74,
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    category: "Mouse",
    stock: 16,
    active: true,
    createdAt: new Date("Jan 30, 2026"),
    updatedAt: new Date("Jan 30, 2026"),
  },
  {
    id: 6,
    sku: "HEADSET-STUDIO-06",
    name: "Studio Chat Headset",
    description: "Padded wired headset with inline controls for calls and gaming.",
    price: 82,
    imageUrl:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    category: "Headset",
    stock: 22,
    active: true,
    createdAt: new Date("Feb 4, 2026"),
    updatedAt: new Date("Feb 4, 2026"),
  },
];

export const storeCategories: StoreCategorySeed[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
  },
  {
    id: 3,
    name: "Home",
    slug: "home",
  },
  {
    id: 4,
    name: "Books",
    slug: "books",
  },
];

export const storeProducts: StoreProductSeed[] = [
  {
    id: 1,
    name: "Noise-Cancelling Headphones",
    slug: "noise-cancelling-headphones",
    description:
      "Wireless over-ear headphones with active noise cancellation and a 30-hour battery life.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    priceCents: 19900,
    stockQuantity: 25,
    active: true,
    categorySlug: "electronics",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description:
      "A lightweight watch for tracking workouts, heart rate, sleep, and everyday notifications.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    priceCents: 14900,
    stockQuantity: 18,
    active: true,
    categorySlug: "electronics",
  },
  {
    id: 3,
    name: "Organic Cotton Hoodie",
    slug: "organic-cotton-hoodie",
    description:
      "Soft mid-weight hoodie made from organic cotton with a relaxed everyday fit.",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    priceCents: 7900,
    stockQuantity: 40,
    active: true,
    categorySlug: "clothing",
  },
  {
    id: 4,
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description:
      "Minimal ceramic dripper and matching server for slow, clean coffee brewing at home.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    priceCents: 5400,
    stockQuantity: 15,
    active: true,
    categorySlug: "home",
  },
  {
    id: 5,
    name: "Full-Stack Field Guide",
    slug: "full-stack-field-guide",
    description:
      "A practical handbook for building, testing, and deploying modern web applications.",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    priceCents: 3200,
    stockQuantity: 60,
    active: true,
    categorySlug: "books",
  },
  {
    id: 6,
    name: "Desk Organizer Tray",
    slug: "desk-organizer-tray",
    description:
      "Compact wooden tray with divided spaces for stationery, cables, and everyday desk tools.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    priceCents: 2700,
    stockQuantity: 30,
    active: true,
    categorySlug: "home",
  },
];

export const storeUsers: StoreUserSeed[] = [
  {
    id: 1,
    name: "Demo Customer",
    email: "customer@example.com",
    password: "password123",
    role: "USER",
  },
  {
    id: 2,
    name: "Store Admin",
    email: "store-admin@example.com",
    password: "password123",
    role: "ADMIN",
  },
];

function getPostByUrlId(urlId: string) {
  return posts.find((post) => post.urlId === urlId);
}

export function getPostViews(urlId: string) {
  const post = getPostByUrlId(urlId);

  if (!post) {
    return 0;
  }

  return viewsByUrlId.get(urlId) ?? post.views;
}

export function incrementPostViews(urlId: string) {
  const post = getPostByUrlId(urlId);

  if (!post) {
    return 0;
  }

  const nextViews = getPostViews(urlId) + 1;
  viewsByUrlId.set(urlId, nextViews);

  return nextViews;
}
