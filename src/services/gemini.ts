import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const schema: any = {
	description: "Nutrition analysis of a meal",
	type: SchemaType.OBJECT,
	properties: {
		name: {
			type: SchemaType.STRING,
			description: "Nome do prato ou refeição",
		},
		items: {
			type: SchemaType.ARRAY,
			items: {
				type: SchemaType.OBJECT,
				properties: {
					name: { type: SchemaType.STRING, description: "Nome do alimento" },
					calories: {
						type: SchemaType.NUMBER,
						description: "Calorias estimadas",
					},
					protein: {
						type: SchemaType.NUMBER,
						description: "Proteína em gramas",
					},
					carbs: {
						type: SchemaType.NUMBER,
						description: "Carboidratos em gramas",
					},
					fat: { type: SchemaType.NUMBER, description: "Gordura em gramas" },
				},
				required: ["name", "calories", "protein", "carbs", "fat"],
			},
		},
		totalCalories: { type: SchemaType.NUMBER },
		totalProtein: { type: SchemaType.NUMBER },
		totalCarbs: { type: SchemaType.NUMBER },
		totalFat: { type: SchemaType.NUMBER },
	},
	required: [
		"name",
		"items",
		"totalCalories",
		"totalProtein",
		"totalCarbs",
		"totalFat",
	],
};

const model = genAI.getGenerativeModel({
	model: "gemini-flash-latest",
	generationConfig: {
		responseMimeType: "application/json",
		responseSchema: schema,
	},
});

const SYSTEM_PROMPT = `
Você é um nutricionista especialista em análise visual de alimentos.
Sua tarefa é analisar a imagem ou descrição de uma refeição e fornecer um breakdown nutricional detalhado e realista.
Sempre retorne os nomes em Português do Brasil.
Se houver múltiplos itens, liste cada um com suas macros estimadas.
Estime o tamanho da porção visualmente se houver uma imagem.
`;

export async function analyzeImage(base64Image: string) {
	if (!API_KEY) throw new Error("GEMINI_API_KEY não configurada.");

	const imageData = base64Image.split(",")[1];
	const prompt = "Analise esta refeição nutricionalmente.";

	const result = await model.generateContent([
		SYSTEM_PROMPT,
		{
			inlineData: {
				data: imageData,
				mimeType: "image/jpeg",
			},
		},
		prompt,
	]);

	return JSON.parse(result.response.text());
}

export async function analyzeText(text: string) {
	if (!API_KEY) throw new Error("GEMINI_API_KEY não configurada.");

	const prompt = `Analise a seguinte refeição: "${text}"`;

	const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
	return JSON.parse(result.response.text());
}
