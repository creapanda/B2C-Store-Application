import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const STORE_AUTH_COOKIE = "store_auth_token";
const STORE_AUTH_MAX_AGE = 60 * 60 * 24 * 7;
const STORE_AUTH_TTL_MS = STORE_AUTH_MAX_AGE * 1000;

export type StoreAuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

type StoreAuthPayload = StoreAuthUser & {
  exp: number;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getStoreAuthSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getStoreAuthSecret())
    .update(payload)
    .digest("base64url");
}

function serializeStoreAuthPayload(user: StoreAuthUser) {
  const payload = encodeBase64Url(
    JSON.stringify({
      ...user,
      exp: Date.now() + STORE_AUTH_TTL_MS,
    } satisfies StoreAuthPayload),
  );

  return `${payload}.${signPayload(payload)}`;
}

function parseStoreAuthPayload(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as Partial<StoreAuthPayload>;

    if (
      typeof parsed.id !== "number" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.exp !== "number" ||
      parsed.exp < Date.now()
    ) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
    } satisfies StoreAuthUser;
  } catch {
    return null;
  }
}

export async function getStoreAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORE_AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return parseStoreAuthPayload(token);
}

export function setStoreAuthCookie(response: {
  cookies: {
    set: (
      name: string,
      value: string,
      options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax";
        path: string;
        maxAge: number;
      },
    ) => void;
  };
}, user: StoreAuthUser) {
  response.cookies.set(STORE_AUTH_COOKIE, serializeStoreAuthPayload(user), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: STORE_AUTH_MAX_AGE,
  });
}

export function clearStoreAuthCookie(response: {
  cookies: {
    delete: (name: string) => void;
  };
}) {
  response.cookies.delete(STORE_AUTH_COOKIE);
}
