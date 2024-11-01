import type { Request, Response } from "express";
import { Browser, Page } from "puppeteer";
import { startNewPuppeteerBrowserPage } from "../config/puppeteer";
import { startBot } from "./start-bot";

export default class LotomaniaController {
	static async start(req: Request, res: Response) {
		try {
			const { browser, page }: { browser: Browser; page: Page } = await startNewPuppeteerBrowserPage();

			await startBot(page);

			// browser.close();

			return { success: true };
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
			};
		}
	}
}
