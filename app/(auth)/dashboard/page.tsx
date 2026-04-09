import type { Metadata } from "next";
import PageTitle from "@/components/page-title";
import { Suspense } from "react";
import DataContainer from "@/components/dashboard/data-container";
import Skeleton from "@/components/skeletons/dashboard-data";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ day?: string; month?: string }>;
}) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/login");
  }
  const params = await searchParams;

  return (
    <>
      <PageTitle text="Dashboard" />
      <Suspense fallback={<Skeleton />}>
        <DataContainer params={params} />
      </Suspense>
    </>
  );
}
