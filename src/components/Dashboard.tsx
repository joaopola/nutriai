import React, { useState } from "react";
import { SummaryCard } from "./SummaryCard";
import { MealList } from "./MealList";
import { HistoryChart } from "./HistoryChart";
import { MealForm } from "./MealForm";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Dashboard = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
						Seu Resumo
					</h1>
					<p className="text-slate-500 dark:text-slate-400">
						Acompanhe seus macros e calorias de hoje.
					</p>
				</div>
				<button
					onClick={() => setIsFormOpen(true)}
					className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/30"
				>
					<Plus size={20} />
					<span>Adicionar Refeição</span>
				</button>
			</div>

			<SummaryCard />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<MealList />
				</div>
				<div className="space-y-8">
					<HistoryChart />
				</div>
			</div>

			<AnimatePresence>
				{isFormOpen && (
					<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsFormOpen(false)}
							className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
						>
							<MealForm onClose={() => setIsFormOpen(false)} />
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};
