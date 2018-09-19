![](https://raw.githubusercontent.com/kritzware/twitch-bot/v2.0.0/example.png)

# Twitch Bot · [![NPM version](https://img.shields.io/npm/v/twitch-bot.svg)](https://www.npmjs.org/package/twitch-bot) ![](https://img.shields.io/npm/dm/twitch-bot.svg) [![CircleCI](https://circleci.com/gh/kritzware/twitch-bot.svg?style=shield&circle-token=3d338af28058e84dde13bee88751a50f55aefab3)](https://circleci.com/gh/kritzware/twitch-bot)

Hello world this is a test

## Install

Install the package with yarn, or npm:

```bash
$ yarn add twitch-bot
```

## Example

```javascript
import TwitchBot from 'twitch-bot'

const Bot = new TwitchBot({
  username: 'teddy',
  oauth: 'oauth:your-oauth-token',
  channels: ['#westworld'],
})

await Bot.connect()

Bot.on('message', ({ message }) => {
  if (message === '!hello') {
    Bot.say('Hello world!')
  }
})
```
