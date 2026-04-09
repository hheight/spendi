"use server";

import {
  signupSchema,
  signinSchema,
  type SignupInput,
  type SigninInput
} from "@/lib/auth/schemas";
import { createSession, deleteSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { ActionResponse } from "@/types";
import { checkPasswordHash, hashPassword } from "@/lib/auth/password";
import { config } from "@/lib/auth/config";

export async function signup(data: SignupInput): Promise<ActionResponse> {
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists"
      };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: {
          create: {
            hash: hashedPassword
          }
        }
      }
    });

    await createSession(user.id, config.jwt.defaultDuration, config.jwt.secret);
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "An error occurred while creating your account"
    };
  }

  redirect("/dashboard");
}

export async function login(data: SigninInput): Promise<ActionResponse> {
  const validatedFields = signinSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true }
    });

    if (!user || !user.password?.hash) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }

    const isMatch = await checkPasswordHash(password, user.password.hash);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }

    await createSession(user.id, config.jwt.defaultDuration, config.jwt.secret);
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occured during login" };
  }

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
