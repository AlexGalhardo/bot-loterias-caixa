import * as https from "https";
import "dotenv/config";
import { ENABLE_TELEGRAM_LOGS } from "../utils/constants.util";
import DateTime from "../utils/date-time.util";

class TelegramLogger {
	private readonly baseUrl: string;

	constructor(
		private readonly token: string = process.env.TELEGRAM_BOT_HTTP_TOKEN,
		private readonly channelId: number = Number(process.env.TELEGRAM_BOT_CHANNEL_ID),
	) {
		this.isThereToken(token);
		this.isThereChannelId(channelId);
		this.token = token;
		this.channelId = channelId;
		this.baseUrl = `https://api.telegram.org/bot${this.token}`;
	}

	private isThereToken(token: string) {
		if (!token) throw new Error("There is no Telegram Token in TelegramLogger Class Constructor");
	}

	private isThereChannelId(channelId: number) {
		if (typeof channelId !== "number" || channelId <= 0) {
			throw new Error("There is no valid Telegram Channel Id in TelegramLogger Class Constructor");
		}
	}

	private log(logType: string, message: string) {
		if (ENABLE_TELEGRAM_LOGS) {
			const messageToSend = `${logType} \n\nCriado em: ${DateTime.getNow()} ${message}`;

			const urlParams = encodeURI(`chat_id=${this.channelId}&text=${messageToSend}&parse_mode=HTML`);

			const url = `${this.baseUrl}/sendMessage?${urlParams}`;

			this.sendRequest(url);
		}
	}

	private sendRequest(url: string): void {
		https
			.get(url, (res: { on?: any; statusCode?: any }) => {
				const { statusCode } = res;
				if (statusCode !== 200) {
					let data: string;
					res.on("data", (chunk: string) => {
						data += chunk;
					});
					res.on("end", () => {
						throw new Error(data);
					});
				}
			})
			.on("error", (error: any) => {
				throw new Error(error.message);
			});
	}

	error(message: string) {
		this.log(`🚨 ERROR 🚨`, message);
	}

	info(message: string) {
		this.log(`💬 INFO 💬`, message);
	}
}

const TelegramLog = new TelegramLogger(
	process.env.TELEGRAM_BOT_HTTP_TOKEN,
	Number(process.env.TELEGRAM_BOT_CHANNEL_ID),
);

export default TelegramLog;
