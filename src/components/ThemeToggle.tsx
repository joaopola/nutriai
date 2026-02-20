import { Moon, Sun } from "lucide-react";
import { useNutritionStore } from "../store/useNutritionStore";
import { useEffect } from "react";

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useNutritionStore();

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
			aria-label="Alternar tema"
		>
			{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
		</button>
	);
};
