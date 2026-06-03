import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  function toggleTheme() {
    const next = !isDark;
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return { isDark, toggleTheme };
}
