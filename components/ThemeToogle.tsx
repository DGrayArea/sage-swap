import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    } else {
      setTheme("light");
    }
  }, [setTheme]);

  const themeHandler = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme.toString());
  };
  return (
    <button className="pr-3 transition-all duration-100">
      {theme === "light" ? (
        <MoonIcon onClick={() => themeHandler("dark")} className="w-6 lg:w-7" />
      ) : (
        <SunIcon onClick={() => themeHandler("light")} className="w-6 lg:w-7" />
      )}
    </button>
  );
}
