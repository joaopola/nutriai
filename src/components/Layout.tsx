import React from "react";
import { Header } from "./Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
			<Header />
			<main className="container mx-auto px-4 py-8 pb-24">{children}</main>
			<nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:hidden">
				<div className="flex justify-around items-center">
					{/* Mobile nav items could go here if needed, but for now we keep it simple */}
				</div>
			</nav>
		</div>
	);
};
