# RSS Notifier

## Description

A simple script to read entries from an RSS feed and send them to a Telegram chat using the token of a Telegram Bot.

The first time it runs, it will send all the posts from the last hour. From then on, it will send only the posts created since the last time the script ran.

## Usage

Just execute the script providing the bot token, the chat ID and, optionally, the RSS feed URL. If no URL is provided, [The Verge](http://www.theverge.com/rss/index.xml) one will be used.

Example:

```bash
node index.js 999999999:ZZEUGMJdTnVErUEQyTPBtYz3UYfe7te_mno @AwesomeChat http://feeds.arstechnica.com/arstechnica/technology-lab
```

I recommend setting a cron job to run it periodically.
