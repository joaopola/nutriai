import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NutritionState, Meal, UserGoals } from "../types";

const INITIAL_GOALS: UserGoals = {
	calories: 2000,
	protein: 150,
	carbs: 200,
	fat: 65,
};

const SEED_MEALS: Meal[] = [
	{
		id: "1",
		name: "Omelete de Claras com Espinafre",
		calories: 250,
		protein: 30,
		carbs: 5,
		fat: 12,
		time: "08:00",
		category: "café da manhã",
		date: new Date().toISOString().split("T")[0],
	},
	{
		id: "2",
		name: "Frango Grelhado com Arroz Integral",
		calories: 450,
		protein: 40,
		carbs: 45,
		fat: 8,
		time: "12:30",
		category: "almoço",
		date: new Date().toISOString().split("T")[0],
	},
	{
		id: "3",
		name: "Iogurte Grego com Blueberries",
		calories: 180,
		protein: 15,
		carbs: 20,
		fat: 4,
		time: "16:00",
		category: "lanche",
		date: new Date().toISOString().split("T")[0],
	},
	{
		id: "4",
		name: "Salmão Assado com Aspargos",
		calories: 520,
		protein: 35,
		carbs: 10,
		fat: 35,
		time: "20:00",
		category: "jantar",
		date: new Date().toISOString().split("T")[0],
	},
	{
		id: "5",
		name: "Shake de Whey Protein",
		calories: 120,
		protein: 24,
		carbs: 3,
		fat: 1,
		time: "10:00",
		category: "lanche",
		date: new Date().toISOString().split("T")[0],
	},
];

export const useNutritionStore = create<NutritionState>()(
	persist(
		(set, get) => ({
			meals: SEED_MEALS,
			goals: INITIAL_GOALS,
			theme: "light",

			addMeal: (mealData) => {
				const newMeal: Meal = {
					...mealData,
					id: Math.random().toString(36).substring(2, 9),
				};
				set((state) => ({ meals: [...state.meals, newMeal] }));
			},

			removeMeal: (id) => {
				set((state) => ({ meals: state.meals.filter((m) => m.id !== id) }));
			},

			updateGoals: (goals) => set({ goals }),

			toggleTheme: () =>
				set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

			getDailyStats: (date) => {
				const dailyMeals = get().meals.filter((m) => m.date === date);
				return dailyMeals.reduce(
					(acc, meal) => ({
						calories: acc.calories + meal.calories,
						protein: acc.protein + meal.protein,
						carbs: acc.carbs + meal.carbs,
						fat: acc.fat + meal.fat,
					}),
					{ calories: 0, protein: 0, carbs: 0, fat: 0 },
				);
			},
		}),
		{
			name: "nutri-ai-storage",
		},
	),
);
