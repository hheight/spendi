'use server';

import { signupSchema, type SignupInput } from '@/lib/auth/schemas';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

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
        message: 'An account with this email already exists'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = prisma.user.create({
      data: {
        email,
        password: {
          create: {
            hash: hashedPassword
          }
        }
      }
    });

    // session logic
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An error occurred while creating your account'
    };
  }

  return { success: true };
}
