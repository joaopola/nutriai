import { Coffee, Utensils, Moon, Sandwich, Trash2 } from "lucide-react";
import { useNutritionStore } from "../store/useNutritionStore";
import { MealCategory } from "../types";
import { motion, AnimatePresence } from "framer-motion";

const CategoryIcon = ({ category }: { category: MealCategory }) => {
	switch (category) {
		case "café da manhã":
			return (
				<Coffee
					className="text-orange-500"
					size={20}
				/>
			);
		case "almoço":
			return (
				<Utensils
					className="text-green-500"
					size={20}
				/>
			);
		case "jantar":
			return (
				<Moon
					className="text-indigo-500"
					size={20}
				/>
			);
		case "lanche":
			return (
				<Sandwich
					className="text-yellow-500"
					size={20}
				/>
			);
		default:
			return null;
	}
};

export const MealList = () => {
	const { meals, removeMeal } = useNutritionStore();
	const today = new Date().toISOString().split("T")[0];
	const todayMeals = meals.filter((m) => m.date === today);

	if (todayMeals.length === 0) {
		return (
			<div className="card flex flex-col items-center justify-center py-12 text-center">
				<div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
					<Utensils
						className="text-slate-400"
						size={32}
					/>
				</div>
				<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
					Nenhuma refeição ainda
				</h3>
				<p className="text-slate-500 dark:text-slate-400">
					Adicione sua primeira refeição para começar.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold text-slate-900 dark:text-white">
				Refeições de Hoje
			</h2>
			<div className="space-y-3">
				<AnimatePresence mode="popLayout">
					{todayMeals.map((meal) => (
						<motion.div
							key={meal.id}
							layout
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="card bg-white dark:bg-slate-800 p-4 flex items-center justify-between group"
						>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
									<CategoryIcon category={meal.category} />
								</div>
								<div>
									<h4 className="font-semibold text-slate-900 dark:text-white">
										{meal.name}
									</h4>
									<div className="flex gap-2 mt-1">
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
											{meal.time}
										</span>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
											P: {meal.protein}g
										</span>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
											C: {meal.carbs}g
										</span>
										<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
											G: {meal.fat}g
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<span className="text-lg font-bold text-slate-900 dark:text-white">
									{meal.calories}{" "}
									<span className="text-sm font-normal text-slate-500">
										kcal
									</span>
								</span>
								<button
									onClick={() => removeMeal(meal.id)}
									className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};
