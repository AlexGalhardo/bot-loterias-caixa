import puppeteer from "puppeteer-extra";
import { type Browser } from "puppeteer";

export async function configPuppeteerBrowser(): Promise<Browser> {
	const args = [
		"--disable-web-security",
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-infobars",
		"--disable-dev-shm-usage",
		"--disable-features=site-per-process",
		"--ignore-certificate-errors",
		"--ignore-certificate-errors-spki-list",
		"--window-position=0,0",
		'--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5793.0"',
		"--disable-blink-features=AutomationControlled",
		"--start-maximized",
		"--disable-extensions",
	];

	console.log("\n\n...Puppeteer is using Browser in PATH: ", process.env.BROWSER_PATH);

	return puppeteer.launch({
		headless: process.env.HEADLESS === "true" ? true : false,
		args,
		executablePath: process.env.BROWSER_PATH,
	});
}
