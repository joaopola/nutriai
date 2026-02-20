import { ThemeToggle } from "./ThemeToggle";
import { Apple } from "lucide-react";

export const Header = () => {
	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
						<Apple size={24} />
					</div>
					<span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
						NutriAI
					</span>
				</div>
				<ThemeToggle />
			</div>
		</header>
	);
};
