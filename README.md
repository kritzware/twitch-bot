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

Bot.on('error', err => {
  console.log(err)
})
```

## Index
- [Events](https://github.com/kritzware/twitch-bot#events)
- [Methods](https://github.com/kritzware/twitch-bot#methods)

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

### `error - (err: Object)`
Emitted when any errors occurs in the Twitch IRC channel, or when attempting to connect to a channel.

#### Error types
##### `Login authentication failed`
This error occurs when either your twitch username or oauth are incorrect/invalid.

Response:
```javscript
{ message: 'Login authentication failed' }
```

##### `Improperly formatted auth`
This error occurs when your oauth password is not formatted correctly. The valid format should be `"oauth:your-oauth-password-123"`.

Response:
```javscript
{ message: 'Improperly formatted auth' }
```

#### Usage
```javascript
Bot.on('error', err => ... )
```

#### Example Response
```javascript
{ message: 'Some error happened in the IRC channel' }
```

## Methods
### `say(message: String, err: Callback)`
Send a message in the currently connected Twitch channel. An optional callback is provided for validating if the message was sent correctly.

#### Example
```javascript
Bot.say('This is a message')

Bot.say('Pretend this message is over 500 characters', err => {
  sent: false,
  message: 'Exceeded PRIVMSG character limit (500)'
  ts: '2017-08-13T16:38:54.989Z'
})
```
