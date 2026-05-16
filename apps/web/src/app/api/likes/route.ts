import { addLike, getLikeState, removeLike } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const anyRequest = request as any;
  return anyRequest.ip || anyRequest.socket?.remoteAddress || "unknown";
}

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return body as { urlId?: string };
  }

  const formData = await request.formData();
  return { urlId: String(formData.get("urlId") ?? "") };
}

export async function GET(request: NextRequest) {
  const urlId = request.nextUrl.searchParams.get("urlId");

  if (!urlId) {
    return NextResponse.json({ error: "Missing urlId" }, { status: 400 });
  }

  const state = await getLikeState(urlId, getClientIp(request));

  if (!state) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  const { urlId } = await parseRequestBody(request);

  if (!urlId) {
    return NextResponse.json({ error: "Missing urlId" }, { status: 400 });
  }

  const state = await addLike(urlId, getClientIp(request));

  if (!state) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(state);
}

export async function DELETE(request: NextRequest) {
  const { urlId } = await parseRequestBody(request);

  if (!urlId) {
    return NextResponse.json({ error: "Missing urlId" }, { status: 400 });
  }

  const state = await removeLike(urlId, getClientIp(request));

  if (!state) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(state);
}
