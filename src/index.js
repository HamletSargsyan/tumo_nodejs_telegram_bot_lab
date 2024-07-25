const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()


const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });


const commands = [
  {
    command: "start",
    description: "start"
  },
]

bot.setMyCommands(commands)

const defaultOptions = {
  parse_mode: "html"
}



/* -------------------------------------------------------------------------- */
/*                                    utils                                   */
/* -------------------------------------------------------------------------- */

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * @param {TelegramBot.Message} message 
 * @param {String} command 
 * @returns {boolean} 
 */
function commandEq(message, command) {
  return true ? message.text === `/${command}` : false
}


/**
 * @param {TelegramBot.Message} message 
 * @param {String} text 
 * @returns {boolean}
 */
function textEq(message, text) {
  return true ? message.text.toLowerCase() === text.toLowerCase() : false
}



/* -------------------------------------------------------------------------- */
/*                                  handlers                                  */
/* -------------------------------------------------------------------------- */


bot.on('text', (message) => {
  const chatId = message.chat.id;

  switch (message.text.toLowerCase().trim()) {
    case "/start":

      bot.sendMessage(chatId, "start cmd")
      break;
  }
})

