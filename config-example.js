export default {
    telegram: {
        bot_token: "TELEGRAM_BOT_API_TOKEN",
        chat_id: "TELEGRAM_CHAT_ID"
    },
    github: {
        webhook_secret: "GITHUB_WEBHOOK_SECRET"
    },
    ssl: { // Delete 'ssl' block to use HTTP mode
        cert: "your_cert.pem",
        key: "your_fullchain.pem"
    },
    port: 8080
}

