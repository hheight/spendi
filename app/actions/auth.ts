"use server";

import {
  signupSchema,
  signinSchema,
  type SignupInput,
  SigninInput
} from "@/lib/auth/schemas";
import { createSession, deleteSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/app/actions/types";

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

    const hashedPassword = await bcrypt.hash(password, 10);

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

    await createSession(user.id);

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "An error occurred while creating your account"
    };
  }
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

    const isMatch = await bcrypt.compare(password, user.password.hash);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }

    await createSession(user.id);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occured during login" };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
