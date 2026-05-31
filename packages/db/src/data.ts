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

export type StoreUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

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
