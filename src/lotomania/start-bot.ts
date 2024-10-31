import "dotenv/config";
import { Page } from "puppeteer";
import TelegramLog from "../config/telegram-logger.config";

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

    console.log("Passo 13 -> Criando os 7 jogos de R$ 3,00 cada um...");

    while (gamesToMade < 7) {
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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await page.waitForSelector("#codigoPix", { visible: true });

        const codigoPixValue = await page.$eval("#codigoPix", (input) => (input as HTMLInputElement).value);

        TelegramLog.info(
            `\n\nPagar Novo Jogo Lotomania!\n\nPIX: ${codigoPixValue}\n\nValor total das apostas: ${valorTotalApostas}\n\n${concursos}`,
        );

        console.log(`Passo 21 -> Copiou valor codigoPixValue e enviou dados para o Telegram!!!`);
    } catch (error: any) {
        console.log("Failed to copy value from 'codigoPix':", error.message);
        throw new Error(error.message);
    }

    console.log(`\n\nBOT Loteria Galhardo Finalizado!\n\n`);
}
