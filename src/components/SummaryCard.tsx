import React from "react";
import { motion } from "framer-motion";
import { useNutritionStore } from "../store/useNutritionStore";
import { cn } from "../utils/cn";

interface MacroBarProps {
	label: string;
	current: number;
	goal: number;
	unit: string;
	color: string;
}

const MacroBar = ({ label, current, goal, unit, color }: MacroBarProps) => {
	const percentage = Math.min(Math.round((current / goal) * 100), 100);

	return (
		<div className="space-y-2">
			<div className="flex justify-between text-sm font-medium">
				<span className="text-slate-600 dark:text-slate-400 capitalize">
					{label}
				</span>
				<span className="text-slate-900 dark:text-slate-100">
					{current}
					{unit} / {goal}
					{unit}
				</span>
			</div>
			<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
					className={cn("h-full rounded-full", color)}
				/>
			</div>
		</div>
	);
};

export const SummaryCard = () => {
	const { goals, getDailyStats } = useNutritionStore();
	const today = new Date().toISOString().split("T")[0];
	const stats = getDailyStats(today);

	const remaining = goals.calories - stats.calories;
	const percentage = Math.round((stats.calories / goals.calories) * 100);

	// Visual indicators (green, yellow, red)
	const getProgressColor = () => {
		if (percentage > 100) return "text-red-500";
		if (percentage > 85) return "text-yellow-500";
		return "text-primary-500";
	};

	const getBarColor = () => {
		if (percentage > 100) return "bg-red-500";
		if (percentage > 85) return "bg-yellow-500";
		return "bg-primary-500";
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="card space-y-8"
		>
			<div className="flex flex-col items-center justify-center space-y-4 py-4">
				<div className="relative w-48 h-48 flex items-center justify-center">
					<svg className="w-full h-full transform -rotate-90">
						<circle
							cx="96"
							cy="96"
							r="88"
							fill="transparent"
							stroke="currentColor"
							strokeWidth="12"
							className="text-slate-100 dark:text-slate-800"
						/>
						<motion.circle
							cx="96"
							cy="96"
							r="88"
							fill="transparent"
							stroke="currentColor"
							strokeWidth="12"
							strokeDasharray={552.92}
							initial={{ strokeDashoffset: 552.92 }}
							animate={{
								strokeDashoffset:
									552.92 - (552.92 * Math.min(percentage, 100)) / 100,
							}}
							transition={{ duration: 1.5, ease: "easeInOut" }}
							className={getProgressColor()}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute flex flex-col items-center">
						<span className="text-4xl font-black text-slate-900 dark:text-white">
							{remaining > 0 ? remaining : Math.abs(remaining)}
						</span>
						<span className="text-sm font-medium text-slate-500 dark:text-slate-400">
							{remaining >= 0 ? "kcal restantes" : "kcal acima"}
						</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<MacroBar
					label="proteína"
					current={stats.protein}
					goal={goals.protein}
					unit="g"
					color="bg-blue-500"
				/>
				<MacroBar
					label="carboidratos"
					current={stats.carbs}
					goal={goals.carbs}
					unit="g"
					color="bg-orange-500"
				/>
				<MacroBar
					label="gorduras"
					current={stats.fat}
					goal={goals.fat}
					unit="g"
					color="bg-yellow-500"
				/>
			</div>
		</motion.div>
	);
};
