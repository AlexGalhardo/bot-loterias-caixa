import "dotenv/config";
import { Page } from "puppeteer";
import TelegramLog from "../config/telegram-logger.config";
import { randomUUID } from "crypto";
import DateTime from "@/utils/date-time.util";
import { readFileSync, writeFileSync } from "node:fs";

interface Played {
    id: string;
    created_at: string;
    concurso: any;
    pix: any;
    total: any;
    played: any[];
}

const readJsonFile = (filePath: string): Played[] => {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Played[];
};

const writeJsonFile = (filePath: string, data: Played[]): void => {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export async function startBot(page: Page) {
    console.log(`\n\nComeçando BOT Loteria Galhardo...\n\n`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        await page.goto(process.env.LOTERIAS_CAIXA_LOTOMANIA_URL, { waitUntil: "networkidle0" }); // 'domcontentloaded', networkidle2, networkidle0
        // await page.goto('https://www.loteriasonline.caixa.gov.br/silce-web/#/home')
        console.log("Passo 1 -> entrando na página");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        await page.waitForSelector(".linkAposta a", { visible: true });
        await page.click(".linkAposta a");
        console.log("Passo 2 -> clicando no link aposta");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#botaosim", { visible: true });
        await page.click("#botaosim");
        console.log("Passo 3 -> clicando no botão sim");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#btnLogin", { visible: true });
        await page.click("#btnLogin");
        console.log("Passo 4 -> clicando botão login");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#username", { visible: true });
        await page.type("#username", process.env.CPF);
        console.log("Passo 5 -> colocando cpf");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#button-submit", { visible: true });
        await page.click("#button-submit");
        console.log("Passo 6 -> clicando no botão enviar código para email");
        TelegramLog.info(`\n\nEnviado código de login das loterias CAIXA no seu email!`);
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("button[name='login']", { visible: true });
        await page.click("button[name='login']");
        console.log("Passo 7 -> clicando no botão enviar código para email");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#codigo", { visible: true });
        await page.waitForFunction(() => (document.querySelector("#codigo") as HTMLInputElement)?.value.length > 0, {
            timeout: 0,
        });
        console.log("Passo 8 -> esperando colocar manualmente código enviado por email");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("button[name='login'][onclick='return validDV()']", { visible: true });
        await page.click("button[name='login'][onclick='return validDV()']");
        console.log("Passo 9 -> clicando no butão login");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#password", { visible: true });
        await page.type("#password", process.env.PASSWORD);
        console.log("Passo 10 -> inserindo senha");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
        await page.waitForSelector(".button-group button[tabindex='1']", { visible: true });
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll(".button-group button[tabindex='1']")).find(
                (btn) => btn.textContent?.trim() === "Entrar",
            );
            if (button) (button as HTMLElement).click();
        });
        console.log("Passo 11 -> clicando no botão Entrar");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("li .data-jogo-menu-lotomania", { visible: true });
        await page.click("li .data-jogo-menu-lotomania");
        console.log("Passo 12 -> clicando no botão Lotomania");
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let gamesToMade = 0;
    const HOW_MUCH_GAMES_TO_PLAY = 7;

    console.log("Passo 13 -> Criando os 7 jogos de R$ 3,00 cada um...");

    while (gamesToMade < HOW_MUCH_GAMES_TO_PLAY) {
        try {
            await page.waitForSelector("#completeojogo", { visible: true });
            await page.click("#completeojogo");
        } catch (error: any) {
            console.log("Failed to click 'Complete o Jogo' button:", error.message);
            throw new Error(error.message);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            await page.waitForSelector("#colocarnocarrinho", { visible: true });
            await page.click("#colocarnocarrinho");
        } catch (error: any) {
            console.log("Failed to click 'Colocar no Carrinho' button:", error.message);
            throw new Error(error.message);
        }

        gamesToMade++;
        console.log(`Passo 13 -> Criou jogo ${gamesToMade}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#irparapagamento", { visible: true });
        await page.click("#irparapagamento");
        console.log(`Passo 14 -> Clicou no button Ir para pagamento`);
    } catch (error: any) {
        console.log("Failed to click 'Ir para pagamento' button:", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#confirma", { visible: true });
        await page.click("#confirma");
        console.log(`Passo 15 -> Clicou no button do modal Confirmar`);
    } catch (error: any) {
        console.log("Failed to click 'Confirmar' button:", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("span img[alt='Pix']", { visible: true });
        await page.click("span img[alt='Pix']");
        console.log(`Passo 16 -> Clicou na imagem para pagar com PIX`);
    } catch (error: any) {
        console.log("Failed to click the Pix payment method:", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("input[type='checkbox'][ng-model='vm.confirmacao']", { visible: true });
        await page.click("input[type='checkbox'][ng-model='vm.confirmacao']");
        console.log(`Passo 17 -> Clicou no checkbox para confirmar pagamento com PIX`);
    } catch (error: any) {
        console.log("Failed to click the confirmation checkbox:", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#payPix", { visible: true });
        await page.click("#payPix");
        console.log(`Passo 18 -> Clicou no button Pagar Agora`);
    } catch (error: any) {
        console.log("Failed to click 'Pagar Agora!' button:", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let valorTotalApostas = null;
    let concursos = null;

    try {
        await page.waitForSelector("#valortotalapostas", { visible: true });
        valorTotalApostas = await page.$eval("#valortotalapostas", (span) => span.textContent);
        console.log(`Passo 19 -> Copiou valor valorTotalApostas`);
    } catch (error: any) {
        console.log("Failed to copy value from 'valortotalapostas':", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("p.ng-binding", { visible: true });
        concursos = await page.$eval("p.ng-binding", (p) => {
            return p.textContent;
        });
        console.log(`Passo 20 -> Copiou valor concursos`);
    } catch (error: any) {
        console.log("Failed to copy value from 'Concurso':", error.message);
        throw new Error(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    let games = [];
    let [game1, game2, game3, game4, game5, game6, game7] = [[], [], [], [], [], [], []];

    console.log(`Passo 21 -> Copiando os 50 números de cada um dos ${HOW_MUCH_GAMES_TO_PLAY} jogos...`);

    try {
        await page.waitForSelector(".content-volantes", { timeout: 30000 });
        await new Promise((resolve) => setTimeout(resolve, 2000));

        games = await page.evaluate(() => {
            const allNumbers = Array.from(document.querySelectorAll(".volante.lotomania span.margemVolante")).map(
                (span) => parseInt(span.textContent.trim(), 10),
            );

            // Split numbers into separate arrays, each with 50 elements
            const gamesSplit = [];
            for (let i = 0; i < 7; i++) {
                const start = i * 50;
                gamesSplit.push(allNumbers.slice(start, start + 50));
            }

            // Log the separated numbers
            console.log("Games extracted: ", gamesSplit);
            return gamesSplit;
        });

        // Destructure the games array into separate variables for each game
        [game1, game2, game3, game4, game5, game6, game7] = games;
        console.log(`Passo 21 -> Copiou os 50 números de cada um dos ${HOW_MUCH_GAMES_TO_PLAY} jogos!\n\n`);
        console.log({ game1, game2, game3, game4, game5, game6, game7 });
        console.log("\n\n");
    } catch (error: any) {
        console.log("ERRO: Passo 21 ao copiar os 50 números de cada um dos 7 jogos -> ", error.message);
        throw new Error(error.message);
    }

    try {
        await page.waitForSelector("#codigoPix", { visible: true });

        const codigoPixValue = (await page.$eval("#codigoPix", (input) => (input as HTMLInputElement).value)).replace(
            /\s+/g,
            "",
        );

        console.log(`Passo 22 -> Salvando dados no banco de dados JSON...`);

        const currentData = readJsonFile("./src/repositories/jsons/played.json");

        const newObject: Played = {
            id: randomUUID(),
            created_at: DateTime.getNow(),
            concurso: concursos.replace("Concurso: ", ""),
            pix: codigoPixValue,
            total: valorTotalApostas,
            played: games,
        };

        currentData.push(newObject);

        writeJsonFile("./src/repositories/jsons/played.json", currentData);

        TelegramLog.info(
            `\n\nPagar Novo Jogo Lotomania!\n\nPIX: ${codigoPixValue}\n\nValor total das apostas: ${valorTotalApostas}\n\n${concursos}\n\nNúmeros dos jogos:\n\n` +
            `JOGO 1\n[${game1.join(", ")}]\n\n` +
            `JOGO 2\n[${game2.join(", ")}]\n\n` +
            `JOGO 3\n[${game3.join(", ")}]\n\n` +
            `JOGO 4\n[${game4.join(", ")}]\n\n` +
            `JOGO 5\n[${game5.join(", ")}]\n\n` +
            `JOGO 6\n[${game6.join(", ")}]\n\n` +
            `JOGO 7\n[${game7.join(", ")}]\n\n`,
        );

        console.log(`Passo 23 -> Copiou valor codigoPixValue e enviou dados para o Telegram!!!`);
    } catch (error: any) {
        console.log("Failed to copy value from 'codigoPix':", error.message);
        throw new Error(error.message);
    }

    console.log(`\n\nBOT Loteria Galhardo Finalizado!\n\n`);
}
