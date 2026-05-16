import { createPost, getAllPosts } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

function validatePostBody(body: unknown) {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { title?: unknown }).title === "string" &&
    typeof (body as { description?: unknown }).description === "string" &&
    typeof (body as { content?: unknown }).content === "string" &&
    typeof (body as { category?: unknown }).category === "string" &&
    typeof (body as { imageUrl?: unknown }).imageUrl === "string" &&
    typeof (body as { tags?: unknown }).tags === "string"
  );
}

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!validatePostBody(body)) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 },
    );
  }

  const post = await createPost({
    title: body.title,
    description: body.description,
    content: body.content,
    category: body.category,
    imageUrl: body.imageUrl,
    tags: body.tags,
    active: body.active !== undefined ? Boolean(body.active) : true,
    date: body.date ? new Date(body.date) : new Date(),
    urlId: typeof body.urlId === "string" ? body.urlId : undefined,
  });

  return NextResponse.json(post, { status: 201 });
}
