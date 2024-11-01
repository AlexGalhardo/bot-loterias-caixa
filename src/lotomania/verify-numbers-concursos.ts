import "dotenv/config";
import { Browser, Page } from "puppeteer";
import fs from "fs";
import TelegramLog from "../config/telegram-logger.config";
import { startNewPuppeteerBrowserPage } from "@/config/puppeteer";

export async function verifyNumbersConcursos() {
	const { browser, page }: { browser: Browser; page: Page } = await startNewPuppeteerBrowserPage();

	console.log(`\n\nComeçando Verificação de números da Lotomania...\n\n`);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	try {
		await page.goto(process.env.GOOGLE_SEARCH_LOTOMANIA_NUMBERS_URL, { waitUntil: "networkidle0" });
		console.log(`Passo 1 -> Entrando na página ${process.env.GOOGLE_SEARCH_LOTOMANIA_NUMBERS_URL}`);
	} catch (error: any) {
		console.log(error.message);
		throw new Error(error.message);
	}

	await new Promise((resolve) => setTimeout(resolve, 2000));

	let lotomaniaWinnerNumbers = [];
	let accumulatedValue = null;
	let concurso = null;

	try {
		await page.waitForSelector(".Z30kQd", { timeout: 30000 });
		lotomaniaWinnerNumbers = (
			await page.evaluate(() => {
				return Array.from(document.querySelectorAll(".Z30kQd .zSMazd")).map((span) => span.textContent.trim());
			})
		).map((num) => parseInt(num, 10));
		// console.log("lotomaniaWinnerNumbers: ", lotomaniaWinnerNumbers);
	} catch (error: any) {
		console.log(error.message);
		throw new Error(error.message);
	}

	try {
		await page.waitForSelector(".br1ue", { timeout: 30000 });
		accumulatedValue = await page.evaluate(() => {
			const valueElement = document.querySelector(".br1ue");
			return valueElement ? valueElement.textContent.trim() : null;
		});
		// console.log("accumulatedValue -> ", accumulatedValue);
	} catch (error: any) {
		console.log(error.message);
		throw new Error(error.message);
	}

	try {
		await page.waitForSelector(".qLLird", { timeout: 30000 });
		concurso = await page.evaluate(() => {
			const infoElement = document.querySelector(".qLLird span");
			return infoElement ? infoElement.textContent.trim() : null;
		});
		// console.log("concurso -> ", concurso);
	} catch (error: any) {
		console.log(error.message);
		throw new Error(error.message);
	}

	let playedGames;

	try {
		const data = fs.readFileSync("./src/repositories/jsons/played.json", "utf-8");
		playedGames = JSON.parse(data);
	} catch (error: any) {
		console.log(error.message);
		throw new Error(error.message);
	}

	console.log(`\n\nPasso 2 -> Verificando números sorteados do concurso: ${concurso.match(/\d+/)[0]}`);

	const game = playedGames.find((game) => game.concurso === concurso.match(/\d+/)[0]);

	if (!game) return console.log(`Nenhum jogo jogado para o ${concurso.match(/\d+/)[0]}`);

	game.played.forEach((arrayNumbersPlayed, index) => {
		const matchingNumbers = arrayNumbersPlayed.filter((num) => lotomaniaWinnerNumbers.includes(num));
		if (matchingNumbers.length >= 16) {
			console.log(
				`\n\n---------- Resultados LOTOMANIA ----------`,
				`\n\n${concurso}`,
				`\n\nValor acumulado: ${accumulatedValue}`,
				`\n\nVocê acertou ${matchingNumbers.length} números!`,
				`\n\nNúmeros sorteados: [${lotomaniaWinnerNumbers}]`,
				`\n\nNúmeros que você acertou: [${matchingNumbers}]`,
				`\n\nJogo com os 50 números que você acertou ${matchingNumbers.length} números: \n[${arrayNumbersPlayed}]`,
			);

			TelegramLog.info(
				`\n\n---------- Resultados LOTOMANIA ----------` +
					`\n\n${concurso}` +
					`\n\nValor acumulado: ${accumulatedValue}` +
					`\n\nVocê acertou ${matchingNumbers.length} números!` +
					`\n\nNúmeros sorteados: [${lotomaniaWinnerNumbers.join(", ")}]` +
					`\n\nNúmeros que você acertou: [${matchingNumbers.join(", ")}]` +
					`\n\nJogo com os 50 números em que você acertou ${matchingNumbers.length} números: \n[${arrayNumbersPlayed}]`,
			);
		}
	});
}
