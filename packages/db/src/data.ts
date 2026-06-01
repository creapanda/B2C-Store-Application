export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

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

const viewsByUrlId = new Map<string, number>();

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const posts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2022"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 320,
    likes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2020"),
    category: "React",
    tags: "Front-End,Optimisation",
    views: 10,
    likes: 1,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("Dec 16, 2024"),
    category: "React",
    tags: "Front-End,Dev Tools",
    views: 22,
    likes: 2,
    active: true,
  },
  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    date: new Date("Dec 16, 2012"),
    category: "React",
    tags: "Programming,Mainframes",
    views: 22,
    likes: 1,
    active: false,
  },
];

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
