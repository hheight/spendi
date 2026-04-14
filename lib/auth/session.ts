import "server-only";

import crypto from "crypto";
import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/app/generated/prisma";
import { config } from "@/lib/auth/config";
import { getUserByRefreshToken, saveRefreshToken } from "@/lib/data";

const isProd =
  process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    const validUserId = validateJWT(accessToken, config.jwt.secret);

    if (validUserId) return { isAuth: true, userId: validUserId };
  }

  const refreshToken = cookieStore.get("refresh_token")?.value;
  const userId = await refreshAccessToken(refreshToken);

  if (!userId) {
    redirect("/login");
  }

  return { isAuth: true, userId };
});

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

export async function createSession(userId: User["id"]) {
  const jwt = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
  const expiresAtJWT = new Date(Date.now() + config.jwt.defaultDuration * 1000);

  const refreshToken = makeRefreshToken();
  const expiresAtRefreshToken = new Date(Date.now() + config.jwt.refreshDuration);
  await saveRefreshToken(userId, refreshToken, expiresAtRefreshToken);

  const cookieStore = await cookies();

  cookieStore.set("access_token", jwt, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAtJWT,
    sameSite: "lax",
    path: "/"
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAtRefreshToken,
    sameSite: "lax",
    path: "/"
  });
}

export async function updateAccessToken(userId: User["id"]) {
  const jwt = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
  const expiresAt = new Date(Date.now() + config.jwt.defaultDuration * 1000);

  const cookieStore = await cookies();

  cookieStore.set("access_token", jwt, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "lax",
    path: "/"
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
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

function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
