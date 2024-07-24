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
 * @param {*} message 
 * @param {String} text 
 * @returns {boolean}
 */
function textEq(message, text) {
  return true ? message.text.toLowerCase() === text.toLowerCase() : false
}



/* -------------------------------------------------------------------------- */
/*                                  handlers                                  */
/* -------------------------------------------------------------------------- */



const emojis = ["🪨", "✂️", "📄"]


const gameMarkup = {
  inline_keyboard: [
    [
      { text: emojis[0], callback_data: "0" },
      { text: emojis[1], callback_data: "1" },
      { text: emojis[2], callback_data: "2" },
    ],
  ],
}


bot.on('text', (message) => {
  const chatId = message.chat.id;

  switch (message.text.toLowerCase().trim()) {
    case "/start":

      bot.sendMessage(chatId, "start cmd", {
        reply_markup: gameMarkup
      })
      break;
  }
})


let score = {
  user: 0,
  bot: 0
}

bot.on('callback_query', (call) => {
  const chatId = call.message.chat.id;
  const emojiIndex = parseInt(call.data)

  let mess = "";
  let userChoice = emojiIndex;
  let botChoice = randint(0, 2)

  mess += `\n\nbot ${emojis[botChoice]} | ${call.from.first_name} ${emojis[userChoice]}`

  if (userChoice === botChoice) {
    mess += `\n\nbot: +0 (${score.bot}) | user: +0 (${score.user})`
  } else if (
    (userChoice === 0 && botChoice === 2) ||
    (userChoice === 1 && botChoice === 0) ||
    (userChoice === 2 && botChoice === 1)
  ) {
    score.user++
    mess += `\n\nuser: +1 (${score.user})`
  } else {
    score.bot++
    mess += `\n\nbot: +1 (${score.bot})`
  }

  let markup;
  if (score.user >= 10) {
    mess += "\n\n<b>u win</b>"
  } else if (score.bot >= 10) {
    mess += "\n\n<b>bot win</b>"
  } else {
    markup = gameMarkup
  }

  bot.sendMessage(chatId, mess, {
    reply_markup: markup,
    ...defaultOptions
  })
  bot.answerCallbackQuery(call.id)
})
