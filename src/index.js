const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios")

require('dotenv').config()


const token = process.env.BOT_TOKEN;
const openweather_api_key = process.env.OPENWEATHER_API_KEY

const DEFAULT_CITY = 'Yerevan';

const bot = new TelegramBot(token, { polling: true });


const commands = [
  {
    command: "start",
    description: "start"
  },
  {
    command: "weather",
    description: "weather"
  },
  {
    command: "set_city",
    description: "set city"
  }
]

bot.setMyCommands(commands)

const defaultOptions = {
  parse_mode: "html"
}


let users_info = {}


/* -------------------------------------------------------------------------- */
/*                                    utils                                   */
/* -------------------------------------------------------------------------- */

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweather_api_key}&units=metric`;
  try {
    const response = await axios.get(url);
    if (response.status_code) { }
    const weatherData = response.data;
    return weatherData;
  } catch (error) {
    throw error;
  }
};


function textEq(text1, text2) {
  return true ? text1 === text2 : false;
}


/**
 * @param {TelegramBot.Message} message 
 * @param {String} command 
 * @returns {boolean} 
 */
function commandEq(message, command) {
  return true ? message.text.toLowerCase().trim().split(" ")[0] === `/${command}` : false
}

/* -------------------------------------------------------------------------- */
/*                                  handlers                                  */
/* -------------------------------------------------------------------------- */


bot.on('text', (message) => {
  const chatId = message.from.id;
  let args = message.text.toLowerCase().trim().split(" ")

  if (commandEq(message, "start")) {
    bot.sendMessage(chatId, "start cmd")
  } else if (commandEq(message, "weather")) {
    let city;
    if (args.length > 1) {
      city = args[1]
    } else {
      if (chatId in users_info) {
        city = users_info[chatId]
      } else {
        city = DEFAULT_CITY
      }
    }

    getWeather(city)
      .then(weather => {
        mess = `<b>Weather in ${city}</b>\n\n`
        mess += "<b><u>[weather]</u></b>\n"
        mess += `<b>description:</b> ${weather.weather[0].description}\n`
        mess += `<b>temp:</b> ${weather.main.temp}°C\n`
        mess += `<b>min temp:</b> ${weather.main.temp_min} | <b>max temp:</b> ${weather.main.temp_max}\n\n`
        mess += "<b><u>[wind]</u></b>\n"
        mess += `<b>speed:</b> ${weather.wind.speed} meter/sec`

        bot.sendMessage(chatId, mess, defaultOptions)
      })
      .catch(error => {
        if (error.response.status === 404) {
          bot.sendMessage(chatId, "Unknown city")
          return
        }
        bot.sendMessage(chatId, `<b>ERROR</b>: ${error}`, defaultOptions)
      });
  } else if (commandEq(message, "set_city")) {
    if (args.length === 1) {
      mess = `<b>Usage:</b> <code>${args[0]} [city name]</code>`
      bot.sendMessage(chatId, mess, defaultOptions)
      return
    }

    users_info[chatId] = args[1]
    bot.sendMessage(chatId, "Done ✅")
  }
})







