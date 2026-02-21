import imageCompression from "browser-image-compression";

export async function compressImage(file: File) {
	const options = {
		maxSizeMB: 0.8,
		maxWidthOrHeight: 1200,
		useWebWorker: true,
	};

	try {
		const compressedFile = await imageCompression(file, options);
		return compressedFile;
	} catch (error) {
		console.error("Erro ao comprimir imagem:", error);
		return file; // Retorna original em caso de erro
	}
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
}
