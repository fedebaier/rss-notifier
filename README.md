# RSS Notifier

## Description

A simple script to read entries from an RSS feed and send them to a Telegram chat using the token of a Telegram Bot.

The first time it runs, it will send all the posts from the last hour. From then on, it will send only the posts created since the last time the script ran.

## Usage

First, create a `.env` file using the template (`.env.template`) providing the bot token and the chat ID.
Then run the script and, optionally, provide the RSS feed URL. If no URL is provided, [The Verge](http://www.theverge.com/rss/index.xml) one will be used.

Example:

```bash
node index.js http://feeds.arstechnica.com/arstechnica/technology-lab
```

I recommend setting a cron job to run it periodically.
