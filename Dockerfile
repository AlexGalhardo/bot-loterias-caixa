# Use a slim version of Node.js for the build stage
FROM node:20.11.1-slim AS builder

# Set the working directory
WORKDIR /usr/www/bot-loteria

# Set environment variables
ENV SERVER_PORT=3000 \
    NODE_ENV=local \
    LOTERIAS_CAIXA_LOTOMANIA_URL=https://loterias.caixa.gov.br/Paginas/Lotomania.aspx \
    GOOGLE_SEARCH_LOTOMANIA_NUMBERS_URL=https://www.google.com/search?q=caixa+lotomania \
    HEADLESS=true \
    CPF=45672888828 \
    PASSWORD=15915915 \
    LOCALE_DATE_TIME=pt-BR \
    BROWSER_PATH="/usr/bin/google-chrome" \
    ENABLE_TELEGRAM_LOGS=true \
    TELEGRAM_BOT_HTTP_TOKEN=7648290812:AAGAZFunY3wZy3qcOiZNu46P6jNPninvLKQ \
    TELEGRAM_BOT_CHANNEL_ID=1477312913 \
    GOOGLE_CLIENT_ID=780167494697-u4ca3hibrer9cim6b1lg8c61k03gcah1.apps.googleusercontent.com \
    GOOGLE_CLIENT_SECRET=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 \
    START_BOT_FIRST_WEEK_DATE=1 \
    START_BOT_SECOND_WEEK_DATE=3 \
    START_BOT_THIRD_WEEK_DATE=5 \
    START_BOT_HOUR=11 \
    START_BOT_MINUTE=49 \
    VERIFY_LOTOMANIA_FIRST_WEEK_DATE=1 \
    VERIFY_LOTOMANIA_SECOND_WEEK_DATE=3 \
    VERIFY_LOTOMANIA_THIRD_WEEK_DATE=5 \
    VERIFY_LOTOMANIA_HOUR=21 \
    VERIFY_LOTOMANIA_MINUTE=0

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Install Google Chrome
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create a new stage for production
FROM node:20.11.1-slim AS production

# Set the working directory for the production stage
WORKDIR /usr/www/bot-loteria

# Copy built files and node_modules from the builder stage
COPY --from=builder /usr/www/bot-loteria/dist ./dist
COPY --from=builder /usr/www/bot-loteria/node_modules ./node_modules
COPY --from=builder /usr/www/bot-loteria/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
