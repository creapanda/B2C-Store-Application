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
