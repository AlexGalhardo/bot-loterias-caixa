import { z } from "zod";

export const envsLocalValidator = z.object({
	NODE_ENV: z.enum(["local"]),
	SERVER_PORT: z.number().default(3000),
	LOTERIAS_CAIXA_LOTOMANIA_URL: z
		.string()
		.refine((url) => url === "https://loterias.caixa.gov.br/Paginas/Lotomania.aspx", {
			message: "LOTERIAS_CAIXA_LOTOMANIA_URL must be https://loterias.caixa.gov.br/Paginas/Lotomania.aspx",
		}),
	HEADLESS: z.enum(["true", "false"]),
	ENABLE_TELEGRAM_LOGS: z.enum(["true", "false"]),
	TELEGRAM_BOT_HTTP_TOKEN: z.string(),
	TELEGRAM_BOT_CHANNEL_ID: z.string(),
	BROWSER_PATH: z.string().default("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
	LOCALE_DATE_TIME: z.string().default("pt-BR"),
	PASSWORD: z.string(),
	CPF: z.string(),
});
