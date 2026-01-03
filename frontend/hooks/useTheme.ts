import { useTheme } from "next-themes";
import { themeClasses } from "@/lib/theme";

export const useAppTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme || "light";

  const classes = themeClasses[currentTheme as keyof typeof themeClasses] || themeClasses.light;

  return {
    theme: currentTheme,
    classes,
    isDark: currentTheme === "dark",
  };
};
