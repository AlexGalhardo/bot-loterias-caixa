import "dotenv/config";
import { Builder, By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import TelegramLog from "../config/telegram-logger.config";
import { readFileSync, writeFileSync } from "node:fs";
import { getActivationCodeFromGmail } from "./get-gmail-login-token";
import { randomUUID } from "node:crypto";
import DateTime from "@/utils/date-time.util";

const readJsonFile = (filePath) => {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

const writeJsonFile = (filePath, data) => {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export async function startBot() {
    const options = new firefox.Options();
    options.addArguments('--headless'); // Enable headless mode for Firefox
    options.addArguments("--no-sandbox"); // Recommended for headless mode
    options.addArguments("--disable-dev-shm-usage"); // Recommended for headless mode

    const driver = await new Builder().forBrowser("firefox").setFirefoxOptions(options).build();

    try {
        console.log(`\n\nStarting Lottery Bot...\n\n`);

        await driver.sleep(2000);

        // console.log('driver -> ', driver)

        await driver.get(process.env.LOTERIAS_CAIXA_LOTOMANIA_URL);
        console.log(`Step 1 -> Navigated to ${process.env.LOTERIAS_CAIXA_LOTOMANIA_URL}`);

        await driver.sleep(2000);

        // console.log('driver -> ', driver)

        await driver.findElement(By.css(".linkAposta a")).click();
        console.log("Step 2 -> Clicked 'Aposte agora'");

        await driver.sleep(2000);

        await driver.findElement(By.id("botaosim")).click();
        console.log("Step 3 -> Clicked 'Sim'");

        // await driver.wait(until.elementLocated(By.id("botaosim")), 10000);
        // const button = await driver.wait(until.elementIsVisible(driver.findElement(By.id("botaosim"))), 10000); // Ensures it's visible
        // await driver.wait(until.elementIsEnabled(button), 10000); // Ensures the button is enabled
        // await button.click();
        // console.log("Step 3 -> Clicked 'Sim'");

        await driver.sleep(2000);

        await driver.findElement(By.id("btnLogin")).click();
        console.log("Step 4 -> Clicked 'Login'");

        await driver.sleep(2000);

        await driver.findElement(By.id("username")).sendKeys(process.env.CPF);
        console.log("Step 5 -> Entered CPF");

        await driver.sleep(2000);

        await driver.findElement(By.id("button-submit")).click();
        console.log("Step 6 -> Clicked 'Próximo'");

        await driver.sleep(2000);

        await driver.findElement(By.css("button[name='login']")).click();
        console.log("Step 7 -> Clicked 'Receber código'");

        await driver.sleep(5000);

        const activationCode = await getActivationCodeFromGmail();
        TelegramLog.info(`Activation code received: ${activationCode}`);
        await driver.findElement(By.id("codigo")).sendKeys(activationCode);
        console.log(`Step 8 -> Entered activation code`);

        await driver.sleep(2000);

        await driver.findElement(By.css("button[name='login'][onclick='return validDV()']")).click();
        console.log("Step 9 -> Clicked 'Login'");

        await driver.sleep(2000);

        await driver.findElement(By.id("password")).sendKeys(process.env.PASSWORD);
        console.log("Step 10 -> Entered password");

        await driver.sleep(3000);

        const entrarButton = await driver.findElement(By.xpath("//button[contains(text(), 'Entrar')]"));
        await entrarButton.click();
        console.log("Step 11 -> Clicked 'Entrar'");

        await driver.sleep(2000);

        await driver.findElement(By.css("li .data-jogo-menu-lotomania")).click();
        console.log("Step 12 -> Clicked 'Lotomania'");

        await driver.sleep(2000);

        await driver.findElement(By.id("adopt-accept-all-button")).click();
        console.log("Step 12.1 -> Aceitando a PORRA do cookie");

        await driver.sleep(2000);

        let gamesToMade = 0;
        const HOW_MUCH_GAMES_TO_PLAY = 7;

        console.log("Step 13 -> Creating 7 games...");

        while (gamesToMade < HOW_MUCH_GAMES_TO_PLAY) {
            await driver.findElement(By.id("completeojogo")).click();
            console.log(`Step 13 -> Completed game ${gamesToMade + 1}`);

            await driver.sleep(2000);

            await driver.findElement(By.id("colocarnocarrinho")).click();
            gamesToMade++;
            await driver.sleep(2000);
        }

        await driver.findElement(By.id("irparapagamento")).click();
        console.log("Step 14 -> Clicked 'Ir para pagamento'");

        await driver.sleep(2000);

        await driver.findElement(By.id("confirma")).click();
        console.log("Step 15 -> Clicked 'Confirmar'");

        await driver.sleep(2000);

        await driver.findElement(By.css("span img[alt='Pix']")).click();
        console.log("Step 16 -> Selected Pix as payment method");

        await driver.sleep(2000);

        await driver.findElement(By.css("input[type='checkbox'][ng-model='vm.confirmacao']")).click();
        console.log("Step 17 -> Confirmed Pix payment");

        await driver.sleep(2000);

        await driver.findElement(By.id("payPix")).click();
        console.log("Step 18 -> Clicked 'Pagar Agora'");

        const valorTotalApostas = await driver.findElement(By.id("valortotalapostas")).getText();
        console.log(`Step 19 -> Total value: ${valorTotalApostas}`);

        const concursos = await driver.findElement(By.css("p.ng-binding")).getText();
        console.log(`Step 20 -> Contest details: ${concursos}`);

        console.log("Step 21 -> Collecting game numbers...");

        let games = [];
        let [game1, game2, game3, game4, game5, game6, game7] = [[], [], [], [], [], [], []];
        for (let i = 1; i <= HOW_MUCH_GAMES_TO_PLAY; i++) {
            const gameNumbers = [];

            const elements = await driver.findElements(By.css(`#game${i} span.margemVolante`));

            for (const el of elements) {
                const numberText = await el.getText();
                const number = parseInt(numberText, 10);

                if (!isNaN(number)) {
                    gameNumbers.push(number);
                }
            }

            games.push(gameNumbers);
        }

        console.log("Games:", games);

        // Passo 22 -> Salvando dados no banco de dados JSON
        await driver.wait(until.elementLocated(By.id("codigoPix")), 10000);
        const codigoPixValue = (await driver.findElement(By.id("codigoPix")).getAttribute("value")).replace(/\s+/g, "");

        [game1, game2, game3, game4, game5, game6, game7] = games;
        console.log(`Passo 22 -> Salvando dados no banco de dados JSON...`);

        const currentData = readJsonFile("./src/repositories/jsons/played.json");

        const newObject = {
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
        console.log("Error encountered:", error.message);
    } finally {
        // await driver.quit();
    }

    console.log(`\n\nBOT Loteria Galhardo Finalizado!\n\n`);
}
