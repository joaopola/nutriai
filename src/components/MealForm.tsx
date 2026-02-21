import React, { useState, useRef } from "react";
import {
	X,
	Save,
	Camera,
	Image,
	Type,
	Loader2,
	Sparkles,
	AlertCircle,
} from "lucide-react";
import { useNutritionStore } from "../store/useNutritionStore";
import { MealCategory } from "../types";
import { cn } from "../utils/cn";
import { compressImage, fileToBase64 } from "../utils/image";
import { analyzeImage, analyzeText } from "../services/gemini";
import { AIPromptReview } from "./AIPromptReview";
import { motion, AnimatePresence } from "framer-motion";

interface MealFormProps {
	onClose: () => void;
}

type FormMode = "manual" | "ai-photo" | "ai-text";

export const MealForm = ({ onClose }: MealFormProps) => {
	const addMeal = useNutritionStore((state) => state.addMeal);
	const [mode, setMode] = useState<FormMode>("manual");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [aiResult, setAiResult] = useState<any | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [textDescription, setTextDescription] = useState("");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);

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

	const handleManualSubmit = (e: React.FormEvent) => {
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

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);
		setLoading(true);
		try {
			const compressed = await compressImage(file);
			const base64 = await fileToBase64(compressed as File);
			setPreviewImage(base64);

			const result = await analyzeImage(base64);
			setAiResult(result);
		} catch (err: any) {
			if (err.message?.includes("429") || err.message?.includes("quota")) {
				setError(
					"Limite de uso da API excedido. Por favor, aguarde alguns segundos ou verifique sua cota no Google AI Studio.",
				);
			} else {
				setError(err.message || "Erro ao processar imagem.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleTextSubmit = async () => {
		if (!textDescription.trim()) return;

		setError(null);
		setLoading(true);
		try {
			const result = await analyzeText(textDescription);
			setAiResult(result);
		} catch (err: any) {
			if (err.message?.includes("429") || err.message?.includes("quota")) {
				setError(
					"Limite de uso da API excedido. Por favor, aguarde alguns segundos.",
				);
			} else {
				setError(err.message || "Erro ao analisar texto.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleAIConfirm = (finalData: any) => {
		addMeal({
			name: finalData.name,
			calories: finalData.totalCalories,
			protein: finalData.totalProtein,
			carbs: finalData.totalCarbs,
			fat: finalData.totalFat,
			time: new Date().toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
			category: finalData.category,
			date: new Date().toISOString().split("T")[0],
			imageUrl: previewImage || undefined,
			items: finalData.items,
		});
		onClose();
	};

	if (aiResult) {
		return (
			<AIPromptReview
				image={previewImage || undefined}
				data={aiResult}
				onConfirm={handleAIConfirm}
				onCancel={() => {
					setAiResult(null);
					setPreviewImage(null);
				}}
			/>
		);
	}

	return (
		<div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
						Adicionar Refeição
					</h2>
					<p className="text-sm text-slate-500">Como você prefere registrar?</p>
				</div>
				<button
					onClick={onClose}
					className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
				>
					<X size={24} />
				</button>
			</div>

			<div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
				<button
					onClick={() => setMode("ai-photo")}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
						mode === "ai-photo"
							? "bg-white dark:bg-slate-700 shadow-sm text-primary-600"
							: "text-slate-500",
					)}
				>
					<Camera size={16} /> Foto IA
				</button>
				<button
					onClick={() => setMode("ai-text")}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
						mode === "ai-text"
							? "bg-white dark:bg-slate-700 shadow-sm text-primary-600"
							: "text-slate-500",
					)}
				>
					<Type size={16} /> Texto IA
				</button>
				<button
					onClick={() => setMode("manual")}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
						mode === "manual"
							? "bg-white dark:bg-slate-700 shadow-sm text-primary-600"
							: "text-slate-500",
					)}
				>
					Manual
				</button>
			</div>

			{loading ? (
				<div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
					<div className="relative">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
							className="w-16 h-16 border-4 border-slate-100 dark:border-slate-800 border-t-primary-600 rounded-full"
						/>
						<Sparkles
							className="absolute inset-0 m-auto text-primary-600 animate-pulse"
							size={24}
						/>
					</div>
					<div>
						<h3 className="text-lg font-bold text-slate-900 dark:text-white">
							A IA está analisando...
						</h3>
						<p className="text-sm text-slate-500 max-w-[200px]">
							Estimando calorias e macros para você.
						</p>
					</div>
				</div>
			) : (
				<AnimatePresence mode="wait">
					{mode === "ai-photo" && (
						<motion.div
							key="photo"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="space-y-6"
						>
							<div className="grid grid-cols-2 gap-4">
								<button
									onClick={() => cameraInputRef.current?.click()}
									className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-slate-500 hover:text-primary-600"
								>
									<Camera size={40} />
									<span className="text-xs font-bold uppercase tracking-widest">
										Tirar Foto
									</span>
								</button>
								<button
									onClick={() => fileInputRef.current?.click()}
									className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-slate-500 hover:text-primary-600"
								>
									<Image size={40} />
									<span className="text-xs font-bold uppercase tracking-widest">
										Galeria
									</span>
								</button>
							</div>

							<input
								type="file"
								ref={cameraInputRef}
								capture="environment"
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
							/>
							<input
								type="file"
								ref={fileInputRef}
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
							/>

							<div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex gap-3 italic text-xs text-slate-500">
								<Sparkles
									size={16}
									className="shrink-0 text-primary-500"
								/>
								Dica: Fotos claras e de cima ajudam a IA a identificar melhor as
								porções.
							</div>
						</motion.div>
					)}

					{mode === "ai-text" && (
						<motion.div
							key="text"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="space-y-6"
						>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Descreva sua refeição
								</label>
								<textarea
									rows={4}
									placeholder="Ex: 2 colheres de arroz integral, 1 feijão concha, 150g de frango grelhado e salada."
									className="input-field resize-none"
									value={textDescription}
									onChange={(e) => setTextDescription(e.target.value)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-2">
								{[
									"Omelete com 3 ovos",
									"Prato feito arroz e feijão",
									"Iogurte com aveia",
									"Hamburguer artesanal",
								].map((sug) => (
									<button
										key={sug}
										onClick={() => setTextDescription(sug)}
										className="p-3 text-left bg-slate-50 dark:bg-slate-800 text-[10px] font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
									>
										{sug}
									</button>
								))}
							</div>

							<button
								onClick={handleTextSubmit}
								disabled={!textDescription.trim()}
								className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
							>
								<Sparkles size={20} />
								<span>Analisar Texto</span>
							</button>
						</motion.div>
					)}

					{mode === "manual" && (
						<motion.div
							key="manual"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
						>
							<form
								onSubmit={handleManualSubmit}
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
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
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
											[
												"café da manhã",
												"almoço",
												"jantar",
												"lanche",
											] as MealCategory[]
										).map((cat) => (
											<button
												key={cat}
												type="button"
												onClick={() =>
													setFormData({ ...formData, category: cat })
												}
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
						</motion.div>
					)}
				</AnimatePresence>
			)}

			{error && (
				<div className="mt-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex gap-3 text-red-600 dark:text-red-400">
					<AlertCircle
						size={20}
						className="shrink-0"
					/>
					<p className="text-xs font-medium leading-relaxed">{error}</p>
				</div>
			)}
		</div>
	);
};
