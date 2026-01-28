"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [styles, setStyles] = useState<any>({});

  useEffect(() => {
    // Fetch theme settings when site loads
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.primaryColor) {
          // Set CSS Variables dynamically
          const root = document.documentElement;
          root.style.setProperty("--color-primary", data.primaryColor);
          root.style.setProperty("--color-secondary", data.secondaryColor);
          root.style.setProperty("--color-bg", data.backgroundColor);
        }
      })
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  return <>{children}</>;
}