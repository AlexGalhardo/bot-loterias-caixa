FROM node:20.11.1-slim AS builder

WORKDIR /usr/www/bot-loteria

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    BROWSER_PATH=/usr/bin/google-chrome-stable

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.11.1-slim AS production

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r apify && useradd -rm -g apify -G audio,video apify

RUN which google-chrome-stable || true

WORKDIR /usr/www/bot-loteria

COPY --from=builder /usr/www/bot-loteria/dist ./dist
COPY --from=builder /usr/www/bot-loteria/node_modules ./node_modules
COPY --from=builder /usr/www/bot-loteria/package*.json ./

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start:prod"]
