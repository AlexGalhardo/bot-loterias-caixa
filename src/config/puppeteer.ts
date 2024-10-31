import { Browser, Page } from "puppeteer";
import { configPuppeteerBrowser } from "./puppeteer-browser";

export async function startNewPuppeteerBrowserPage(): Promise<{ browser: Browser; page: Page }> {
    try {
        const browser = await configPuppeteerBrowser();

        const pages = await browser.pages();

        if (pages.length > 0) {
            await pages[0].setViewport({
                width: 1280 + Math.floor(Math.random() * 100),
                height: 720 + Math.floor(Math.random() * 100),
            });
            return { browser, page: pages[0] };
        }

        return { browser, page: await browser.newPage() };
    } catch (error: any) {
        throw new Error(error.message);
    }
}
