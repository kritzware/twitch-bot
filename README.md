# twitch-bot [![CircleCI](https://circleci.com/gh/kritzware/twitch-bot.svg?style=svg&circle-token=3d338af28058e84dde13bee88751a50f55aefab3)](https://circleci.com/gh/kritzware/twitch-bot)
Easily create chat bots for Twitch.tv

## Install
Install via NPM
```
$ npm install twitch-bot
```

## Example
```javascript
const TwitchBot = require('twitch-bot')

const Bot = new TwitchBot({
  username: 'Kappa_Bot'
  oauth: 'oauth:dwiaj91j1KKona9j9d1420',
  channel: 'twitch'
})

Bot.on('join', () => {

    Bot.on('message', chatter => {
      if(chatter.message === '!test') {
        Bot.say('Command executed! PogChamp')
      }
    })
})
```

## Events
### `join - ()`
This event is emitted when a connection has been made to the the channel
#### Usage
```javascript
Bot.on('join', () => ... )
```


### `message - (chatter: Object)`
Emitted when a `PRIVSMSG` event is sent over IRC. Chatter object attributes can be found on the [Twitch developers site](https://dev.twitch.tv/docs/v5/guides/irc/#privmsg-twitch-tags)

#### Usage
```javascript
Bot.on('message', chatter => ... )
```

#### Example Response
```javascript
{ color: '#3C78FD',
  display_name: 'kritzware',
  emotes: '88:18-25',
  id: 'c5ee7248-3cea-43f5-ae44-2916d9a1325a',
  mod: true,
  room_id: 44667418,
  sent_ts: 1501541672959,
  subscriber: true,
  tmi_sent_ts: 1501541673368,
  turbo: false,
  user_id: 44667418,
  user_type: 'mod',
  badges: { broadcaster: 1, subscriber: 0 },
  channel: '#kritzware',
  message: 'This is a message PogChamp',
  username: 'Kritzware' }
  ```
