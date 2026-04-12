import "server-only";

import crypto from "crypto";
import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { User } from "@/app/generated/prisma";
import { config } from "@/lib/auth/config";
import { getUserByRefreshToken, saveRefreshToken } from "../dal";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const isProd =
  process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userId: User["id"], expiresIn: number, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000); // current date in seconds
  const expiresAt = issuedAt + expiresIn;

  const token = jwt.sign(
    {
      iss: config.jwt.issuer,
      sub: userId,
      iat: issuedAt,
      exp: expiresAt
    } satisfies Payload,
    secret,
    { algorithm: "HS256" }
  );

  return token;
}

export function validateJWT(tokenString: string, secret: string): string | null {
  let decoded: Payload;

  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      console.error("JWT Error:", e.message);
    }
    return null;
  }

  if (decoded.iss !== config.jwt.issuer) {
    console.error("JWT Error: Invalid issuer");
    return null;
  }

  if (!decoded.sub) {
    console.error("JWT Error: No user ID in token");
    return null;
  }

  return decoded.sub;
}

export async function getSession(secret: string): Promise<string | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) {
    console.error("Invalid session");
    return null;
  }

  return validateJWT(session, secret);
}

export async function createSession(userId: User["id"]) {
  const jwt = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
  const expiresAtJWT = new Date(Date.now() + config.jwt.defaultDuration * 1000);

  const refreshToken = makeRefreshToken();
  const expiresAtRefreshToken = new Date(Date.now() + config.jwt.refreshDuration);
  await saveRefreshToken(userId, refreshToken, expiresAtRefreshToken);

  const cookieStore = await cookies();

  setAccessToken(cookieStore, jwt, expiresAtJWT);
  setRefreshToken(cookieStore, refreshToken, expiresAtRefreshToken);
}

function setAccessToken(
  cookieStore: ReadonlyRequestCookies,
  token: string,
  expiresAt: Date
) {
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "lax",
    path: "/"
  });
}

function setRefreshToken(
  cookieStore: ReadonlyRequestCookies,
  token: string,
  expiresAt: Date
) {
  cookieStore.set("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "strict",
    path: "/"
  });
}

export async function updateAccessToken(userId: User["id"]) {
  const jwt = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
  const expiresAt = new Date(Date.now() + config.jwt.defaultDuration * 1000);

  const cookieStore = await cookies();

  setAccessToken(cookieStore, jwt, expiresAt);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function refreshAccessToken(refreshToken?: string) {
  if (!refreshToken) {
    return null;
  }

  const user = await getUserByRefreshToken(refreshToken);
  if (!user) {
    return null;
  }

  await updateAccessToken(user.id);
  return user.id;
}
