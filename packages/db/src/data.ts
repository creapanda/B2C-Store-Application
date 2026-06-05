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
  {
    id: 7,
    sku: "KEYBOARD-RGB-07",
    name: "RGB Mechanical Keyboard",
    description: "Full-size mechanical keyboard with customizable RGB backlighting and macro support.",
    price: 135,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    category: "Keyboard",
    stock: 15,
    active: true,
    createdAt: new Date("Feb 8, 2026"),
    updatedAt: new Date("Feb 8, 2026"),
  },
  {
    id: 8,
    sku: "KEYBOARD-WIRELESS-08",
    name: "Wireless Compact Keyboard",
    description: "Portable wireless keyboard with 60% layout and rechargeable battery.",
    price: 49,
    imageUrl:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    category: "Keyboard",
    stock: 28,
    active: true,
    createdAt: new Date("Feb 12, 2026"),
    updatedAt: new Date("Feb 12, 2026"),
  },
  {
    id: 9,
    sku: "KEYBOARD-ULTRA-09",
    name: "Ultra-Slim Keyboard",
    description: "Elegant ultra-slim keyboard with quiet scissor switches for office use.",
    price: 39,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    category: "Keyboard",
    stock: 35,
    active: true,
    createdAt: new Date("Feb 15, 2026"),
    updatedAt: new Date("Feb 15, 2026"),
  },
  {
    id: 10,
    sku: "MOUSE-VERTICAL-10",
    name: "Vertical Ergonomic Mouse",
    description: "Unique vertical design to reduce wrist strain with precision tracking sensor.",
    price: 68,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    category: "Mouse",
    stock: 19,
    active: true,
    createdAt: new Date("Feb 18, 2026"),
    updatedAt: new Date("Feb 18, 2026"),
  },
  {
    id: 11,
    sku: "MOUSE-SILENT-11",
    name: "Silent Click Mouse",
    description: "Ultra-quiet mouse with 95% noise reduction for peaceful typing environments.",
    price: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    category: "Mouse",
    stock: 26,
    active: true,
    createdAt: new Date("Feb 22, 2026"),
    updatedAt: new Date("Feb 22, 2026"),
  },
  {
    id: 12,
    sku: "MOUSE-TRACKBALL-12",
    name: "Trackball Mouse",
    description: "Stationary trackball mouse for reduced hand movement and precision control.",
    price: 79,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    category: "Mouse",
    stock: 12,
    active: true,
    createdAt: new Date("Feb 26, 2026"),
    updatedAt: new Date("Feb 26, 2026"),
  },
  {
    id: 13,
    sku: "HEADSET-GAMING-13",
    name: "Ultra Gaming Headset",
    description: "Professional gaming headset with 7.1 surround sound and detachable microphone.",
    price: 155,
    imageUrl:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    category: "Headset",
    stock: 14,
    active: true,
    createdAt: new Date("Mar 2, 2026"),
    updatedAt: new Date("Mar 2, 2026"),
  },
  {
    id: 14,
    sku: "HEADSET-BUDGET-14",
    name: "Budget Wireless Headset",
    description: "Affordable wireless headset with long battery life and basic noise cancellation.",
    price: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Headset",
    stock: 29,
    active: true,
    createdAt: new Date("Mar 5, 2026"),
    updatedAt: new Date("Mar 5, 2026"),
  },
  {
    id: 15,
    sku: "HEADSET-PROFESSIONAL-15",
    name: "Professional Audio Headset",
    description: "Studio-grade headset with flat frequency response for accurate audio monitoring.",
    price: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
    category: "Headset",
    stock: 8,
    active: true,
    createdAt: new Date("Mar 8, 2026"),
    updatedAt: new Date("Mar 8, 2026"),
  },
];
