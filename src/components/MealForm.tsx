import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useNutritionStore } from "../store/useNutritionStore";
import { MealCategory } from "../types";
import { cn } from "../utils/cn";

interface MealFormProps {
	onClose: () => void;
}

export const MealForm = ({ onClose }: MealFormProps) => {
	const addMeal = useNutritionStore((state) => state.addMeal);

	const [formData, setFormData] = useState({
		name: "",
		calories: "",
		protein: "",
		carbs: "",
		fat: "",
		time: new Date().toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		}),
		category: "almoço" as MealCategory,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addMeal({
			name: formData.name,
			calories: Number(formData.calories),
			protein: Number(formData.protein),
			carbs: Number(formData.carbs),
			fat: Number(formData.fat),
			time: formData.time,
			category: formData.category,
			date: new Date().toISOString().split("T")[0],
		});
		onClose();
	};

	return (
		<div className="p-6 md:p-8">
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
					Nova Refeição
				</h2>
				<button
					onClick={onClose}
					className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
				>
					<X size={24} />
				</button>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
						O que você comeu?
					</label>
					<input
						required
						type="text"
						placeholder="Ex: Frango com Batata Doce"
						className="input-field"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Calorias (kcal)
						</label>
						<input
							required
							type="number"
							placeholder="0"
							className="input-field"
							value={formData.calories}
							onChange={(e) =>
								setFormData({ ...formData, calories: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Horário
						</label>
						<input
							required
							type="time"
							className="input-field"
							value={formData.time}
							onChange={(e) =>
								setFormData({ ...formData, time: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Prot (g)
						</label>
						<input
							required
							type="number"
							placeholder="0"
							className="input-field"
							value={formData.protein}
							onChange={(e) =>
								setFormData({ ...formData, protein: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Carbs (g)
						</label>
						<input
							required
							type="number"
							placeholder="0"
							className="input-field"
							value={formData.carbs}
							onChange={(e) =>
								setFormData({ ...formData, carbs: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Gord (g)
						</label>
						<input
							required
							type="number"
							placeholder="0"
							className="input-field"
							value={formData.fat}
							onChange={(e) =>
								setFormData({ ...formData, fat: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
						Categoria
					</label>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
						{(
							["café da manhã", "almoço", "jantar", "lanche"] as MealCategory[]
						).map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setFormData({ ...formData, category: cat })}
								className={cn(
									"py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all",
									formData.category === cat
										? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
										: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
								)}
							>
								{cat}
							</button>
						))}
					</div>
				</div>

				<button
					type="submit"
					className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-4"
				>
					<Save size={20} />
					<span>Salvar Refeição</span>
				</button>
			</form>
		</div>
	);
};
