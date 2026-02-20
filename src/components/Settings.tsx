import React, { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useNutritionStore } from "../store/useNutritionStore";
import { motion, AnimatePresence } from "framer-motion";

export const Settings = () => {
	const { goals, updateGoals } = useNutritionStore();
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState(goals);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateGoals(formData);
		setIsOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-8 right-8 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 z-40"
			>
				<SettingsIcon size={24} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 100 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 100 }}
							className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-8"
						>
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
								Meta Diária
							</h2>
							<p className="text-slate-500 dark:text-slate-400 mb-8">
								Defina seus objetivos para calcular o progresso.
							</p>

							<form
								onSubmit={handleSubmit}
								className="space-y-6"
							>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Calorias Totais (kcal)
									</label>
									<input
										type="number"
										className="input-field"
										value={formData.calories}
										onChange={(e) =>
											setFormData({
												...formData,
												calories: Number(e.target.value),
											})
										}
									/>
								</div>

								<div className="grid grid-cols-3 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
											Prot (g)
										</label>
										<input
											type="number"
											className="input-field"
											value={formData.protein}
											onChange={(e) =>
												setFormData({
													...formData,
													protein: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
											Carbs (g)
										</label>
										<input
											type="number"
											className="input-field"
											value={formData.carbs}
											onChange={(e) =>
												setFormData({
													...formData,
													carbs: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
											Gord (g)
										</label>
										<input
											type="number"
											className="input-field"
											value={formData.fat}
											onChange={(e) =>
												setFormData({
													...formData,
													fat: Number(e.target.value),
												})
											}
										/>
									</div>
								</div>

								<button
									type="submit"
									className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-4"
								>
									<Save size={20} />
									<span>Salvar Metas</span>
								</button>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
};
