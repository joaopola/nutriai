import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Cell,
} from "recharts";
import { useNutritionStore } from "../store/useNutritionStore";
import { useMemo } from "react";

export const HistoryChart = () => {
	const { meals, goals } = useNutritionStore();

	const chartData = useMemo(() => {
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - i);
			return d.toISOString().split("T")[0];
		}).reverse();

		return last7Days.map((date) => {
			const dailyMeals = meals.filter((m) => m.date === date);
			const totalKcal = dailyMeals.reduce((acc, m) => acc + m.calories, 0);

			const dayName = new Date(date).toLocaleDateString("pt-BR", {
				weekday: "short",
			});

			return {
				name: dayName,
				calories: totalKcal,
				goal: goals.calories,
				isOver: totalKcal > goals.calories,
			};
		});
	}, [meals, goals.calories]);

	return (
		<div className="card space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-slate-900 dark:text-white">
					Últimos 7 dias
				</h3>
				<span className="text-xs font-medium text-slate-500 uppercase">
					kcal consumidas
				</span>
			</div>

			<div className="h-[200px] w-full mt-4">
				<ResponsiveContainer
					width="100%"
					height="100%"
				>
					<BarChart data={chartData}>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#94a3b8", fontSize: 12 }}
						/>
						<Tooltip
							cursor={{ fill: "rgba(0,0,0,0.05)" }}
							contentStyle={{
								borderRadius: "12px",
								border: "none",
								boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
								backgroundColor: "rgb(15 23 42)",
								color: "white",
							}}
							labelStyle={{ fontWeight: "bold", color: "white" }}
							itemStyle={{ color: "#4ade80" }}
						/>
						<Bar
							dataKey="calories"
							radius={[4, 4, 0, 0]}
						>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.isOver ? "#ef4444" : "#22c55e"}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="flex items-center gap-4 text-xs">
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 rounded-full bg-primary-500" />
					<span className="text-slate-500">Na meta</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 rounded-full bg-red-500" />
					<span className="text-slate-500">Excedido</span>
				</div>
			</div>
		</div>
	);
};
