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
    sku: "AUDIO-PULSE-01",
    name: "Pulse Wireless Headphones",
    description: "Noise-isolating over-ear headphones with 40 hours of battery.",
    price: 129,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Electronics",
    stock: 18,
    active: true,
    createdAt: new Date("Jan 8, 2026"),
    updatedAt: new Date("Jan 8, 2026"),
  },
  {
    id: 2,
    sku: "HOME-BREW-02",
    name: "Barista Cold Brew Kit",
    description: "Glass cold brew maker with stainless filter and measuring scoop.",
    price: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    category: "Home",
    stock: 24,
    active: true,
    createdAt: new Date("Jan 12, 2026"),
    updatedAt: new Date("Jan 12, 2026"),
  },
  {
    id: 3,
    sku: "STYLE-RAIN-03",
    name: "Commuter Rain Jacket",
    description: "Lightweight waterproof jacket with sealed seams and packable hood.",
    price: 96,
    imageUrl:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
    category: "Clothing",
    stock: 31,
    active: true,
    createdAt: new Date("Jan 18, 2026"),
    updatedAt: new Date("Jan 18, 2026"),
  },
  {
    id: 4,
    sku: "FIT-YOGA-04",
    name: "Studio Yoga Mat",
    description: "Non-slip training mat with dense cushioning for daily practice.",
    price: 44,
    imageUrl:
      "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?auto=format&fit=crop&w=1200&q=80",
    category: "Fitness",
    stock: 40,
    active: true,
    createdAt: new Date("Jan 23, 2026"),
    updatedAt: new Date("Jan 23, 2026"),
  },
  {
    id: 5,
    sku: "TECH-DOCK-05",
    name: "USB-C Travel Dock",
    description: "Compact seven-port dock with HDMI, card reader, and fast charging.",
    price: 74,
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
    category: "Electronics",
    stock: 16,
    active: true,
    createdAt: new Date("Jan 30, 2026"),
    updatedAt: new Date("Jan 30, 2026"),
  },
  {
    id: 6,
    sku: "BAG-CANVAS-06",
    name: "Canvas Day Pack",
    description: "Durable everyday backpack with laptop sleeve and water bottle pockets.",
    price: 82,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    category: "Accessories",
    stock: 22,
    active: true,
    createdAt: new Date("Feb 4, 2026"),
    updatedAt: new Date("Feb 4, 2026"),
  },
];
