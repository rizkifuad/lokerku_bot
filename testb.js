const dotenv = require('dotenv')
const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf');
const db = require('./models')
dotenv.load()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.telegram.sendMessage(60315270, 'menggila')
