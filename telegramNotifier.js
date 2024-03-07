const TelegramBot = require('node-telegram-bot-api');
const token = '6825709343:AAEW4QFb7pL4OuHd4JSK1vt8Z1b8JM0KMB4';
const bot = new TelegramBot(token, { polling: true });
const chatId = '-4188913542';

function notifyPush(pusherName, commitMessage, commitUrl, pushCount) {
  // สร้างข้อความที่รวมข้อมูลจำนวนการ push
  const message = `🔔 New push by ${pusherName}\nCommit Message: ${commitMessage}\nURL: ${commitUrl}\nTotal Pushes Today: ${pushCount} \n🤖🤖 อนุโมทนาบุญ ขอให้เจริญรุ่งเรือง 🤖🤖`;
  bot.sendMessage(chatId, message);
}


module.exports = { notifyPush };
