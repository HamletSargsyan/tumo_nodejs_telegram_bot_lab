const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()


const token = process.env.BOT_TOKEN;



const bot = new TelegramBot(token, { polling: true });


const commands = [
  {
    command: "start",
    description: "start"
  },
  {
    command: "yes",
    description: "yes"
  },
  {
    command: "no",
    description: "no"
  },
  {
    command: "maybe",
    description: "maybe"
  },

]

bot.setMyCommands(commands)

const defaultOptions = {
  parse_mode: "html"
}


const answers = {
  yes: [
    "Всё могу, что угодно; да, но зачем мне это?",
    "Подарки дарят, лишь ждут ли они ответа?",
    "Да, сердце не утихнет, не дремлет любовь в нём"
  ],
  no: [
    "Зачем мне эти муки, что за ними?",
    "В чем вина? Нет вины. Зачем ссориться?",
    "Мгновенной радости нет в жизни; вся её состоит из труда и покоя"
  ],
  maybe: [
    "Туманные дали, душа прозрачна, в ней нейтральная тоска, словно в мире пустом",
    "Лишь в сердце тайна, ответа нет и не будет.",
    "С утра было тихо, днём дождик был, а вечером стало смутно."
  ]
}

/* -------------------------------------------------------------------------- */

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * @param {*} message 
 * @param {String} command 
 */
function commandEq(message, command) {
  return true ? message.text == `/${command}` : false
}

/* -------------------------------------------------------------------------- */

bot.on('text', (message) => {
  const chatId = message.chat.id;

  /* -------------------------------- commands -------------------------------- */
  if (commandEq(message, "start")) {
    bot.sendMessage(chatId, "start cmd", defaultOptions)

  } else if (commandEq(message, "yes")) {
    let index = randint(0, answers["yes"].length - 1);
    let answer = answers["yes"][index];
    bot.sendMessage(chatId, `<b>${answer}</b>`, defaultOptions)

  } else if (commandEq(message, "no")) {
    let index = randint(0, answers["no"].length - 1);
    let answer = answers["no"][index];
    bot.sendMessage(chatId, `<i>${answer}</i>`, defaultOptions)

  } else if (commandEq(message, "maybe")) {
    let index = randint(0, answers["maybe"].length - 1);
    let answer = answers["maybe"][index];
    bot.sendMessage(chatId, `<code>${answer}</code>`, defaultOptions)

  }

  /* -------------------------------------------------------------------------- */



})
