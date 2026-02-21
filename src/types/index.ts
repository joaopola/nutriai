export type MealCategory = "café da manhã" | "almoço" | "jantar" | "lanche";

export interface MealItem {
	name: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface Meal {
	id: string;
	name: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	time: string;
	category: MealCategory;
	date: string; // ISO string YYYY-MM-DD
	imageUrl?: string;
	items?: MealItem[];
}

export interface UserGoals {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface NutritionState {
	meals: Meal[];
	goals: UserGoals;
	theme: "light" | "dark";
	addMeal: (meal: Omit<Meal, "id">) => void;
	removeMeal: (id: string) => void;
	updateGoals: (goals: UserGoals) => void;
	toggleTheme: () => void;
	getDailyStats: (date: string) => {
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	};
}
