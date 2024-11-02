## Erro: Não encontra Chrome Browser para os testes do Puppeteer

1. Se você receber o erro: `Erro ao abrir o browser o navegador: Error: Browser was not found at the configured executablePath`
   - Installe o chrome browser testing do pupetter na raiz desse repositório: <https://pptr.dev/browsers-api>
      - `npx @puppeteer/browsers install chrome@stable`
   - Após instalar romando o comando acima, pegue o caminho completo do binário onde o chrome testing foi instalado e coloque o valor no **.env** BROWSER_PATH=


2. Você também pode usar o caminho do binário default do google-chrome-stable normal de usuários instalado no seu sistema operacional
   - Exemplo no MacOS seria `BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`

3. Tutorial: <https://ploi.io/documentation/server/how-to-install-puppeteer-on-ubuntu>

/root/chrome/linux-130.0.6723.91/chrome-linux64/chrome


sudo apt-get install libx11-xcb1 libxcomposite1 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
