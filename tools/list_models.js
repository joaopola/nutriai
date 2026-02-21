import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local if it exists, otherwise .env
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
	console.error(
		"Erro: VITE_GEMINI_API_KEY não encontrada no .env ou .env.local",
	);
	process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
	try {
		const models = await genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
		}); // Dummy model to get the client
		// Actually the SDK doesn't have a direct top-level listModels in the same way the REST API does easily without extra setup
		// But we can try to hit the endpoint via fetch to be sure
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
		);
		const data = await response.json();

		if (data.models) {
			console.log("Modelos disponíveis para sua conta:");
			data.models.forEach((m) => {
				console.log(
					`- ${m.name} (Suporta: ${m.supportedGenerationMethods.join(", ")})`,
				);
			});
		} else {
			console.log(
				"Nenhum modelo retornado ou erro na resposta:",
				JSON.stringify(data),
			);
		}
	} catch (error) {
		console.error("Erro ao listar modelos:", error);
	}
}

listModels();
