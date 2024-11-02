import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./routes";
import verifyEnvs from "./utils/verify-envs.util";
import { verifyNumbersConcursoLotomania } from "./lotomania/verify-numbers-concurso-lotomania";
import { startBot } from "./lotomania/start-bot";
import TelegramLog from "./config/telegram-logger.config";

verifyEnvs();

const isTimeToExecute = (days: number[], envHour: string, envMinute: string): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    return days.includes(day) && now.getHours() === Number(envHour) && now.getMinutes() === Number(envMinute);
};

const scheduleStartBot = async () => {
    console.log(`...Verificando scheduleStartBot at ${new Date()}`);
    const daysToStartBot = [
        Number(process.env.START_BOT_FIRST_WEEK_DATE),
        Number(process.env.START_BOT_SECOND_WEEK_DATE),
        Number(process.env.START_BOT_THIRD_WEEK_DATE),
    ];

    if (isTimeToExecute(daysToStartBot, process.env.START_BOT_HOUR, process.env.START_BOT_MINUTE)) {
        TelegramLog.info(`\n\nComeçou executar função para criar 7 jogos na LOTOMANIA...`);

        console.log(`\n\nComeçou executar função para criar 7 jogos na LOTOMANIA...`);

        let success = false;
        while (success !== true) {
            success = await startBot();
        }
    }
};

const scheduleVerifyNumbersLotomania = async () => {
    const daysToVerifyLotomania = [
        Number(process.env.VERIFY_LOTOMANIA_FIRST_WEEK_DATE),
        Number(process.env.VERIFY_LOTOMANIA_SECOND_WEEK_DATE),
        Number(process.env.VERIFY_LOTOMANIA_THIRD_WEEK_DATE),
    ];

    if (
        isTimeToExecute(daysToVerifyLotomania, process.env.VERIFY_LOTOMANIA_HOUR, process.env.VERIFY_LOTOMANIA_MINUTE)
    ) {
        TelegramLog.info(`\n\nComeçou executar função para verificar os números sorteados da LOTOMANIA...`);

        console.log(`\n\nComeçou executar função para verificar os números sorteados da LOTOMANIA...`);

        // let success = false;
        // while (success !== true) {
        // 	success = await verifyNumbersConcursoLotomania();
        // }
    }
};

// setInterval(scheduleStartBot, 60000);
// setInterval(scheduleVerifyNumbersLotomania, 60000);

// startBot();
// verifyNumbersConcursoLotomania();
// scheduleVerifyNumbersLotomania()

const server = express();

server.use(express.json());
server.use(cors());
server.use(router);

server.use((error, req, res, next) => {
    res.status(500).json({ success: false, error: error.message });
});

const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, async () => {
    console.log(`\n\n...BOT Loteria Galhardo Funcionando!`);
});
