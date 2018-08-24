'use strict';

const TelegramBot = require('node-telegram-bot-api');
const Parser = require('rss-parser');
const delay = require('delay');
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'last-date');

if (!fs.existsSync(file)) {
  const tempDate = new Date();
  tempDate.setMinutes(tempDate.getMinutes() - 60);
  tempDate.setSeconds(0, 0);
  fs.writeFileSync(file, tempDate.toISOString(), {
    encoding: 'utf8'
  });
}

const prevDate = new Date(fs.readFileSync(file, { encoding: 'utf8' }));
const token = process.argv[2];
const chatId = process.argv[3];
const rssURL = process.argv[4] || 'http://www.theverge.com/rss/index.xml';

if (!token || !chatId) {
  console.log('Please provide a Telegram Bot Token and a Chat ID!');
  process.exit(1);
}

const bot = new TelegramBot(token);
const parser = new Parser();

(async () => {
  let latestDate = new Date();
  latestDate.setSeconds(0, 0);

  const feed = await parser.parseURL(rssURL);
  feed.items.reverse();

  const newItems = feed.items.filter(item => new Date(item.pubDate) > prevDate);

  for (const item of newItems) {
    latestDate = new Date(item.pubDate);

    await bot.sendMessage(chatId, `${item.title}\n\n${item.link}`);

    await delay(2000);
  }

  fs.writeFileSync(file, latestDate.toISOString(), {
    encoding: 'utf8'
  });

  process.exit();
})();
