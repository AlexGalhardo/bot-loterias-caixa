FROM node:20.11.1-slim AS builder

# Install necessary packages for Firefox
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    firefox-esr \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libdbus-glib-1-2 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxtst6 \
    xauth \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/www/bot-loteria

# Set up environment variables to inherit values from the host
ENV SERVER_PORT \
    NODE_ENV \
    LOTERIAS_CAIXA_LOTOMANIA_URL \
    GOOGLE_SEARCH_LOTOMANIA_NUMBERS_URL \
    HEADLESS \
    CPF \
    PASSWORD \
    LOCALE_DATE_TIME \
    BROWSER_PATH="/usr/bin/firefox" \
    ENABLE_TELEGRAM_LOGS \
    TELEGRAM_BOT_HTTP_TOKEN \
    TELEGRAM_BOT_CHANNEL_ID \
    GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET \
    START_BOT_FIRST_WEEK_DATE \
    START_BOT_SECOND_WEEK_DATE \
    START_BOT_THIRD_WEEK_DATE \
    START_BOT_HOUR \
    START_BOT_MINUTE \
    VERIFY_LOTOMANIA_FIRST_WEEK_DATE \
    VERIFY_LOTOMANIA_SECOND_WEEK_DATE \
    VERIFY_LOTOMANIA_THIRD_WEEK_DATE \
    VERIFY_LOTOMANIA_HOUR \
    VERIFY_LOTOMANIA_MINUTE

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
