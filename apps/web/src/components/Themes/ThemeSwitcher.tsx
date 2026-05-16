"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();// <- TODO: Get the theme from the context

  return (
    <Button
      className="rounded-md border border-gray-300 px-3 py-2 text-sm text-primary hover:border-gray-400"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
