"use client";

import { CreditCard, BadgeEuro, HandCoins, ChartColumnBig } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { useSelectedLayoutSegment } from "next/navigation";

import Logo from "@/components/logo";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartColumnBig
  },
  {
    title: "Income",
    url: "/income",
    icon: BadgeEuro
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: HandCoins
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: CreditCard
  }
];

export function AppSidebar() {
  const segment = useSelectedLayoutSegment();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-5">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="px-2 pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={segment === item.title.toLowerCase()}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
