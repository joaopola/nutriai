import React, { useState } from "react";
import { Save, RefreshCcw, ChevronRight, Info } from "lucide-react";
import { MealItem, MealCategory } from "../types";
import { cn } from "../utils/cn";

interface AIPromptReviewProps {
	image?: string;
	data: {
		name: string;
		items: MealItem[];
		totalCalories: number;
		totalProtein: number;
		totalCarbs: number;
		totalFat: number;
	};
	onConfirm: (finalData: any) => void;
	onCancel: () => void;
}

export const AIPromptReview = ({
	image,
	data,
	onConfirm,
	onCancel,
}: AIPromptReviewProps) => {
	const [editedData, setEditedData] = useState(data);
	const [category, setCategory] = useState<MealCategory>("almoço");

	const handleItemChange = (
		index: number,
		field: keyof MealItem,
		value: string | number,
	) => {
		const newItems = [...editedData.items];
		newItems[index] = { ...newItems[index], [field]: value };

		// Recalculate totals
		const totalCalories = newItems.reduce(
			(acc, item) => acc + Number(item.calories),
			0,
		);
		const totalProtein = newItems.reduce(
			(acc, item) => acc + Number(item.protein),
			0,
		);
		const totalCarbs = newItems.reduce(
			(acc, item) => acc + Number(item.carbs),
			0,
		);
		const totalFat = newItems.reduce((acc, item) => acc + Number(item.fat), 0);

		setEditedData({
			...editedData,
			items: newItems,
			totalCalories,
			totalProtein,
			totalCarbs,
			totalFat,
		});
	};

	return (
		<div className="flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
			<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
				<h2 className="text-xl font-bold text-slate-900 dark:text-white">
					Análise da IA
				</h2>
				<button
					onClick={onCancel}
					className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
				>
					Descartar
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-6 space-y-8">
				{image && (
					<div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
						<img
							src={image}
							alt="Meal"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
					</div>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Identificamos:
						</label>
						<input
							className="text-2xl font-black bg-transparent w-full text-slate-900 dark:text-white border-none p-0 focus:ring-0"
							value={editedData.name}
							onChange={(e) =>
								setEditedData({ ...editedData, name: e.target.value })
							}
						/>
					</div>

					<div className="grid grid-cols-4 gap-2">
						<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center">
							<span className="block text-xl font-black text-primary-600">
								{editedData.totalCalories}
							</span>
							<span className="text-[10px] uppercase font-bold text-slate-400">
								kcal
							</span>
						</div>
						<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center">
							<span className="block text-xl font-black text-blue-500">
								{editedData.totalProtein}g
							</span>
							<span className="text-[10px] uppercase font-bold text-slate-400">
								Prot
							</span>
						</div>
						<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center">
							<span className="block text-xl font-black text-orange-500">
								{editedData.totalCarbs}g
							</span>
							<span className="text-[10px] uppercase font-bold text-slate-400">
								Carbs
							</span>
						</div>
						<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center">
							<span className="block text-xl font-black text-yellow-500">
								{editedData.totalFat}g
							</span>
							<span className="text-[10px] uppercase font-bold text-slate-400">
								Gord
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						Breakdown por item
					</label>
					<div className="space-y-3">
						{editedData.items.map((item, idx) => (
							<div
								key={idx}
								className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3"
							>
								<input
									className="font-bold bg-transparent w-full text-slate-900 dark:text-white border-none p-0 focus:ring-0 text-sm"
									value={item.name}
									onChange={(e) =>
										handleItemChange(idx, "name", e.target.value)
									}
								/>
								<div className="grid grid-cols-4 gap-2">
									<input
										type="number"
										className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-1.5 text-center text-xs focus:ring-1 focus:ring-primary-500"
										value={item.calories}
										onChange={(e) =>
											handleItemChange(idx, "calories", e.target.value)
										}
									/>
									<input
										type="number"
										className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-1.5 text-center text-xs focus:ring-1 focus:ring-primary-500"
										value={item.protein}
										onChange={(e) =>
											handleItemChange(idx, "protein", e.target.value)
										}
									/>
									<input
										type="number"
										className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-1.5 text-center text-xs focus:ring-1 focus:ring-primary-500"
										value={item.carbs}
										onChange={(e) =>
											handleItemChange(idx, "carbs", e.target.value)
										}
									/>
									<input
										type="number"
										className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-1.5 text-center text-xs focus:ring-1 focus:ring-primary-500"
										value={item.fat}
										onChange={(e) =>
											handleItemChange(idx, "fat", e.target.value)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-3">
					<label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						Categoria
					</label>
					<div className="grid grid-cols-4 gap-2">
						{(
							["café da manhã", "almoço", "jantar", "lanche"] as MealCategory[]
						).map((cat) => (
							<button
								key={cat}
								onClick={() => setCategory(cat)}
								className={cn(
									"py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all",
									category === cat
										? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
										: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200",
								)}
							>
								{cat.split(" ")[0]}
							</button>
						))}
					</div>
				</div>

				<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3">
					<Info
						className="text-blue-500 shrink-0"
						size={20}
					/>
					<p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
						As informações nutricionais são estimadas pela IA. Para maior
						precisão, você pode ajustar os valores acima.
					</p>
				</div>
			</div>

			<div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
				<button
					onClick={() => onConfirm({ ...editedData, category })}
					className="btn-primary w-full py-4 flex items-center justify-center gap-2"
				>
					<Save size={20} />
					<span>Confirmar e Salvar</span>
				</button>
			</div>
		</div>
	);
};
