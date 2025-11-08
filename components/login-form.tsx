"use client";

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
import { SigninInput, signinSchema } from "@/lib/auth/schemas";
import { login } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SigninInput) => {
    setServerError(null);
    const result = await login(data);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setServerError(result.message || "An error occurred during login");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    autoFocus
                    type="email"
                    id="login-form-email"
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
                  <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="login-form-password"
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
            form="login-form"
            disabled={isSubmitting}
            className="w-full"
          >
            Log in
          </Button>
        </Field>
        <div className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Create one
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
