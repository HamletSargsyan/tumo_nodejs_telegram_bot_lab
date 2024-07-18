const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()


const token = process.env.BOT_TOKEN;


const bot = new TelegramBot(token, { polling: true });
console.info("Bot started")

bot.on('text', (message) => {
  const chatId = message.chat.id;
  bot.sendMessage(chatId, "Բոտը մտածում է․․․");

  setTimeout(() => {
    bot.sendMessage(chatId, message.text)
  }, 5000)


})
