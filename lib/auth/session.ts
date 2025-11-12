import "server-only";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "@/app/generated/prisma";

const secretKey = process.env.SESSION_SECRET;
const isProd =
  process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload extends JWTPayload {
  userId: User["id"];
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"]
    });

    return payload as SessionPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return session;
}

export async function createSession(userId: User["id"]) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: isProd,
    expires: expiresAt,
    sameSite: "lax",
    path: "/"
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
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
