const axios = require('axios');
require('dotenv').config();

async function sendTelegramNotification(message) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message
    };

    try {
        await axios.post(url, data);
        console.log('Telegram notification sent');
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}

module.exports = { sendTelegramNotification };
