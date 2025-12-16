import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddButton({ text, href }: { text: string; href: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={href}>
        {text} <Plus />
      </Link>
    </Button>
  );
}
