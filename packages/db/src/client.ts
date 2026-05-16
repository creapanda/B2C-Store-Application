import { PrismaClient } from "@prisma/client";
import type { Post } from "./data.js";

declare global {
  var prisma: PrismaClient | undefined;
}

type DbLike = {
  userIP: string;
  postId: number;
};

type DbPost = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string;
  date: Date;
  views: number;
  active: boolean;
  Likes?: DbLike[];
};

type EditablePostInput = Pick<
  Post,
  "title" | "description" | "content" | "imageUrl" | "category" | "tags"
> & {
  active?: boolean;
  date?: Date;
  urlId?: string;
};

function getDatabaseUrl() {
  const url = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  return url;
}

function toUrlPath(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapPost(post: DbPost): Post {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    description: post.description,
    content: post.content,
    imageUrl: post.imageUrl,
    category: post.category,
    tags: post.tags,
    date: post.date,
    views: post.views,
    active: post.active,
    likes: post.Likes?.length ?? 0,
  };
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  const prisma = new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
  });

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};

async function findManyPosts(where?: unknown) {
  const records = (await (client.db.post as any).findMany({
    where,
    include: {
      Likes: true,
    },
    orderBy: {
      date: "desc",
    },
  })) as DbPost[];

  return records.map(mapPost);
}

export async function getAllPosts() {
  return findManyPosts();
}

export async function getActivePosts() {
  return findManyPosts({ active: true });
}

export async function getPostByUrlId(urlId: string) {
  const record = (await (client.db.post as any).findUnique({
    where: { urlId },
    include: { Likes: true },
  })) as DbPost | null;

  return record ? mapPost(record) : null;
}

export async function incrementPostViews(urlId: string) {
  const record = (await (client.db.post as any).update({
    where: { urlId },
    data: {
      views: {
        increment: 1,
      },
    },
    include: { Likes: true },
  })) as DbPost | null;

  return record ? mapPost(record) : null;
}

export async function getLikeState(urlId: string, userIP: string) {
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return null;
  }

  const like = await (client.db.like as any).findUnique({
    where: {
      postId_userIP: {
        postId: post.id,
        userIP,
      },
    },
  });

  return {
    likes: post.likes,
    liked: Boolean(like),
  };
}

export async function addLike(urlId: string, userIP: string) {
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return null;
  }

  const existing = await (client.db.like as any).findUnique({
    where: {
      postId_userIP: {
        postId: post.id,
        userIP,
      },
    },
  });

  if (!existing) {
    await (client.db.like as any).create({
      data: {
        postId: post.id,
        userIP,
      },
    });
  }

  return getLikeState(urlId, userIP);
}

export async function removeLike(urlId: string, userIP: string) {
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return null;
  }

  const existing = await (client.db.like as any).findUnique({
    where: {
      postId_userIP: {
        postId: post.id,
        userIP,
      },
    },
  });

  if (existing) {
    await (client.db.like as any).delete({
      where: {
        postId_userIP: {
          postId: post.id,
          userIP,
        },
      },
    });
  }

  return getLikeState(urlId, userIP);
}

export async function createPost(input: EditablePostInput) {
  const record = (await (client.db.post as any).create({
    data: {
      title: input.title,
      description: input.description,
      content: input.content,
      imageUrl: input.imageUrl,
      category: input.category,
      tags: input.tags,
      urlId: input.urlId?.trim() || toUrlPath(input.title),
      active: input.active ?? true,
      date: input.date ?? new Date(),
      views: 0,
    },
    include: { Likes: true },
  })) as DbPost;

  return mapPost(record);
}

export async function updatePost(urlId: string, input: EditablePostInput) {
  const record = (await (client.db.post as any).update({
    where: { urlId },
    data: {
      title: input.title,
      description: input.description,
      content: input.content,
      imageUrl: input.imageUrl,
      category: input.category,
      tags: input.tags,
      active: input.active,
      date: input.date,
      urlId: input.urlId?.trim() || toUrlPath(input.title),
    },
    include: { Likes: true },
  })) as DbPost;

  return mapPost(record);
}

export async function setPostActive(urlId: string, active: boolean) {
  const record = (await (client.db.post as any).update({
    where: { urlId },
    data: {
      active,
    },
    include: { Likes: true },
  })) as DbPost;

  return mapPost(record);
}
