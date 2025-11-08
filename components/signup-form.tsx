"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupInput } from "@/lib/auth/schemas";
import { signup } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: ""
    }
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    const result = await signup(data);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setServerError(result.message || "An error occurred while creating your account");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    type="email"
                    id="signup-form-email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-password">Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="signup-form-password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-password">Confirm Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="signup-form-confirm"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="signup-form"
            disabled={isSubmitting}
            className="w-full"
          >
            Create an account
          </Button>
        </Field>
        <div className="mt-4 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
