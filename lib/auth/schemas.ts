import * as z from 'zod';

export const signinSchema = z.object({
  email: z.email({ message: 'Please enter a valid email' }).trim(),
  password: z.string().min(1, { message: 'Password is required' }).trim()
});

export const signupSchema = z.object({
  email: z.email({ message: 'Please enter a valid email' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' })
    .trim()
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
