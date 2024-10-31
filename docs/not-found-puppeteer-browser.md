## Erro: Não encontra Chrome Browser para os testes do Puppeteer

1. Se você receber o erro: `Erro ao abrir o browser o navegador: Error: Browser was not found at the configured executablePath`
   - Installe o chrome browser testing do pupetter na raiz desse repositório: <https://pptr.dev/browsers-api>
      - `npx @puppeteer/browsers install chrome@stable`
   - Após instalar romando o comando acima, pegue o caminho completo do binário onde o chrome testing foi instalado e coloque o valor no **.env** BROWSER_PATH=


2. Você também pode usar o caminho do binário default do google-chrome-stable normal de usuários instalado no seu sistema operacional
   - Exemplo no MacOS seria `BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`
