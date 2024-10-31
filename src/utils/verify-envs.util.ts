import "dotenv/config";
import { envsLocalValidator } from "./validators/envs-local.validator";

export default function verifyEnvs() {
	if (process.env.NODE_ENV === "local") {
		const envLocalVariables = {
			SERVER_PORT: Number(process.env.SERVER_PORT),
			NODE_ENV: process.env.NODE_ENV,
			LOTERIAS_CAIXA_LOTOMANIA_URL: process.env.LOTERIAS_CAIXA_LOTOMANIA_URL,
			HEADLESS: process.env.HEADLESS,
			CPF: process.env.CPF,
			PASSWORD: process.env.PASSWORD,
			LOCALE_DATE_TIME: process.env.CPF,
			BROWSER_PATH: process.env.BROWSER_PATH,
			ENABLE_TELEGRAM_LOGS: process.env.ENABLE_TELEGRAM_LOGS,
			TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
		};

		const validationResult = envsLocalValidator.safeParse(envLocalVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente LOCAL esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	}
}
