import "server-only";
import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { User } from "@/app/generated/prisma";

const isProd =
  process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
const TOKEN_ISSUER = "spendi";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userId: User["id"], expiresIn: number, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000); // current date in seconds
  const expiresAt = issuedAt + expiresIn;

  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
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

  if (decoded.iss !== TOKEN_ISSUER) {
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

export async function createSession(
  userId: User["id"],
  expiresIn: number,
  secret: string
) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  const jwt = makeJWT(userId, expiresIn, secret);
  const cookieStore = await cookies();

  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "lax",
    path: "/"
  });
}

export async function updateSession(expiresIn: number, secret: string) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    console.error("Invalid session");
    return null;
  }

  const userId = validateJWT(session, secret);

  if (!userId) {
    console.error("Invalid token");
    return null;
  }

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "lax",
    path: "/"
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
