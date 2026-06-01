import { getPostByUrlId, setPostActive, updatePost } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ urlId: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const urlId = params?.urlId;

  if (typeof urlId !== "string") {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const post = await getPostByUrlId(urlId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ urlId: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const urlId = params?.urlId;

  if (typeof urlId !== "string") {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const body = await request.json();
  const post = await updatePost(urlId, {
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    content: typeof body.content === "string" ? body.content : "",
    category: typeof body.category === "string" ? body.category : "",
    imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : "",
    tags: typeof body.tags === "string" ? body.tags : "",
    active: typeof body.active === "boolean" ? body.active : undefined,
    date: body.date ? new Date(body.date) : undefined,
    urlId: typeof body.urlId === "string" ? body.urlId : undefined,
  });

  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ urlId: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const urlId = params?.urlId;

  if (typeof urlId !== "string") {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const body = await request.json();

  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "Missing active flag" }, { status: 400 });
  }

  const post = await setPostActive(urlId, body.active);
  return NextResponse.json(post);
}
