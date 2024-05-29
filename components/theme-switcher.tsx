"use client";

import { Moon, Sun } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border rounded-lg">
        <TabsTrigger
          value="light"
          onClick={() => setTheme("light")}
          className=""
        >
          <Sun className="size-4" />
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          onClick={() => setTheme("dark")}
        >
          <Moon className="size-4 rotate-90 transition-all duration-300 ease-in-out dark:rotate-0" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
