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
 * @param {*} message 
 * @param {String} command 
 * @returns {boolean} 
 */
function commandEq(message, command) {
  return true ? message.text === `/${command}` : false
}


/**
 * 
 * @param {*} message 
 * @param {String} text 
 * @returns {boolean}
 */
function textEq(message, text) {
  return true ? message.text.toLowerCase() === text.toLowerCase() : false
}


class Option {
  constructor (answer, correct_option_idx, options) {
    this.answer = answer
    this.correct_option_idx = correct_option_idx
    this.options = options
  }

  prompt(chatId) {
    bot.sendMessage(chatId, this.answer, {
      reply_markup: this.asMarkup()
    })
  }

  asMarkup() {
    return {
      keyboard: [this.options]
    }
  }

  check(input) {
    if (input === this.options[this.correct_option_idx]) {
      return true
    }
    return false
  }

}

const quiz = [
  new Option("1 + 1", 0, ["2", "5", "11"]),
  new Option("1 OR 0 AND 0", 0, ["0", "1"]),
]


/* -------------------------------------------------------------------------- */
/*                                  handlers                                  */
/* -------------------------------------------------------------------------- */

let optionId = 0

bot.on('text', (message) => {
  const chatId = message.chat.id;
  /* -------------------------------- commands -------------------------------- */
  switch (message.text) {
    case "/start":
      quiz[optionId].prompt(chatId)
      break;
  
    default:
      if (quiz[optionId].check()) {
        optionId += (1 ? optionId < quiz.length : 0)
      } else {
        optionId = 1
        bot.sendMessage(chatId, "restart")
      }
      break;
  }


})
