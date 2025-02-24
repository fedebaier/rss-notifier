import 'dotenv/config';

import { Bot } from 'grammy';
import Parser from 'rss-parser';
import sqlite3 from 'sqlite3';

import { execute, fetchFirst } from './sql.js';

const { BOT_TOKEN, CHAT_ID } = process.env;

if (!BOT_TOKEN || !CHAT_ID) {
  throw new Error('Please configure environment variables!');
}

const bot = new Bot(BOT_TOKEN);

const dbPath = './database.db';
const db = new sqlite3.Database(dbPath);

try {
  await execute(
    db,
    `CREATE TABLE IF NOT EXISTS lastrun (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL);`
  );
  await execute(
    db,
    `CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY,
      url TEXT NOT NULL);`
  );

  let lastRun;
  let latestDate;

  let data = await fetchFirst(db, `SELECT * FROM lastrun WHERE id = 1;`);
  if (!data) {
    lastRun = new Date();
    lastRun.setMinutes(lastRun.getMinutes() - 60);
    lastRun.setSeconds(0, 0);
    await execute(db, `INSERT INTO lastrun (date) VALUES ('${lastRun.toISOString()}');`);
  } else {
    lastRun = new Date(data.date);
  }

  const rssURL = process.argv[2] || 'http://www.theverge.com/rss/index.xml';
  const parser = new Parser();

  const feed = await parser.parseURL(rssURL);
  feed.items.reverse();

  const newItems = feed.items.filter((item) => new Date(item.pubDate) > lastRun);

  for (const item of newItems) {
    latestDate = new Date(item.pubDate);

    data = await fetchFirst(db, `SELECT * FROM urls WHERE url = '${item.link}'`);

    // Only send link if it's not already in the DB
    if (!data) {
      await bot.api.sendMessage(CHAT_ID, `${item.title}\n\n${item.link}`);
      await execute(db, `INSERT INTO urls (url) VALUES ('${item.link}');`);
    } else {
      console.log(`Skip: ${item.link}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Save the latest date if there are new items
  if (latestDate) {
    await execute(db, `UPDATE lastrun SET date = '${latestDate.toISOString()}' WHERE id = 1;`);
  }
  db.close();
  process.exit();
} catch (error) {
  console.log(`Error when trying to parse the RSS: ${error}`);
  db.close();
  process.exit(1);
}
