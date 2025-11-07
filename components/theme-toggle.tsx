"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Contrast } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button title="Toggle theme" variant="ghost" size="icon" onClick={handleClick}>
      <Contrast />
    </Button>
  );
}
