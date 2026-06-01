import {
  deleteStoreSession,
  getStoreUserBySessionToken,
} from "@repo/db/client";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const STORE_SESSION_COOKIE = "store_session";

export type StoreSession = {
  token: string;
  expiresAt: Date;
};

export async function getCurrentStoreUser() {
  const userCookies = await cookies();
  const token = userCookies.get(STORE_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return getStoreUserBySessionToken(token);
}

export async function getCurrentStoreSessionToken() {
  const userCookies = await cookies();
  return userCookies.get(STORE_SESSION_COOKIE)?.value ?? null;
}

export function setStoreSessionCookie(
  response: NextResponse,
  session: StoreSession,
) {
  response.cookies.set(STORE_SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });
}

export async function clearStoreSession(response: NextResponse) {
  const token = await getCurrentStoreSessionToken();

  if (token) {
    await deleteStoreSession(token);
  }

  response.cookies.delete(STORE_SESSION_COOKIE);
}
