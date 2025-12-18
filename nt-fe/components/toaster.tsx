"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useThemeStore } from "@/stores/theme-store";

export function Toaster() {
  const { theme } = useThemeStore();

  return (
    <SonnerToaster
      theme={theme === "dark" ? "dark" : "light"}
      position="bottom-right"
      richColors
    />
  );
}
