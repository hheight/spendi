import type { Metadata } from "next";
import LoginForm from "@/components/login-form";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login"
};

export default async function Page() {
  const session = await verifySession();

  if (session.isAuth) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
