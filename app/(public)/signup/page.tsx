import type { Metadata } from "next";
import SignupForm from "@/components/signup-form";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Signup"
};

export default async function Page() {
  const session = await verifySession();

  if (session.isAuth) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
