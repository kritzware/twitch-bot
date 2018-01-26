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
  username: 'Kappa_Bot',
  oauth: 'oauth:dwiaj91j1KKona9j9d1420',
  channels: ['twitch']
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
  - [`join`](https://github.com/kritzware/twitch-bot#join---)
  - [`part`](https://github.com/kritzware/twitch-bot#part---)
  - [`message`](https://github.com/kritzware/twitch-bot#message---chatter-object)
  - [`timeout`](https://github.com/kritzware/twitch-bot#timeout---event-object)
  - [`subscription`](https://github.com/kritzware/twitch-bot#subscription---event-object)
  - [`ban`](https://github.com/kritzware/twitch-bot#ban---event-object)
  - [`error`](https://github.com/kritzware/twitch-bot#error---err-object)
  - [`close`](https://github.com/kritzware/twitch-bot#close---)
- [Methods](https://github.com/kritzware/twitch-bot#methods)
  - [`join()`](https://github.com/kritzware/twitch-bot#join-channelname--string))
  - [`part()`](https://github.com/kritzware/twitch-bot#part-channelname--string)  
  - [`say()`](https://github.com/kritzware/twitch-bot#saymessage-string-err-callback)
  - [`timeout()`](https://github.com/kritzware/twitch-bot#timeoutusername-string-duration-int-reason-string)
  - [`ban()`](https://github.com/kritzware/twitch-bot#banusername-string-reason-string)
  - [`close()`](https://github.com/kritzware/twitch-bot#close)
- [Tests](https://github.com/kritzware/twitch-bot#running-tests)

## Events
### `join - ()`
This event is emitted when a channel has been joined successfully.
#### Usage
```javascript
Bot.on('join', channel => ... )
```

### `part - ()`
This event is emitted when a channel has been left successfully.
#### Usage
```javascript
Bot.on('part', channel => ... )
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

### `timeout - (event: Object)`
Emitted when a user is timed out in the chat. The `ban_reason` attribute is `null` when no reason message is used.

#### Chat Trigger
```javascript
kritzware: "/timeout {user} {duration} {reason}"
```

#### Usage
```javascript
Bot.on('timeout', event => ... )
```

#### Example Response
```javascript
{ ban_duration: 10, // seconds
  ban_reason: 'Using a banned word',
  room_id: 44667418,
  target_user_id: 37798112,
  tmi_sent_ts: 1503346029068,
  type: 'timeout',
  channel: '#kritzware',
  target_username: 'blarev' }
```

### `subscription - (event: Object)`
Emitted when a user subscribes to a channel and chooses to share the subscription in chat.

#### Usage
```javascript
Bot.on('subscription', event => ... )
```

#### Example Response
```javascript
{
  "badges": {
   "broadcaster": 1,
   "staff": 1,
   "turbo": 1
  },
  "channel": "#dallas",
  "color": "#008000",
  "display_name": "ronni",
  "emotes": null,
  "id": "db25007f-7a18-43eb-9379-80131e44d633",
  "login": "ronni",
  "message": "Great stream -- keep it up!", // null if no message given
  "mod": 0,
  "msg_id": "resub",
  "msg_param_months": 6,
  "msg_param_sub_plan": "Prime",
  "msg_param_sub_plan_name": "Prime",
  "room_id": 1337,
  "subscriber": 1,
  "system_msg": "ronni has subscribed for 6 months!",
  "tmi_sent_ts": 1507246572675,
  "turbo": 1,
  "user_id": 1337,
  "user_type": "staff"
}
```

### `ban - (event: Object)`
Emitted when a user is permanently banned from the chat. The `ban_reason` attribute is `null` when no reason message is used.

#### Usage
```javascript
Bot.on('ban', event => ... )
```

#### Chat Trigger
```javascript
kritzware: "/ban {user} {reason}"
```

#### Example Response
```javascript
{ ban_reason: 'Using a banned word',
  room_id: 44667418,
  target_user_id: 37798112,
  tmi_sent_ts: 1503346078025,
  type: 'ban',
  channel: '#kritzware',
  target_username: 'blarev' }
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

##### `Your message was not sent because you are sending messages too quickly`
This error occurs when a message fails to send due to sending messages too quickly. You can avoid this by making the bot a moderator in the channel, if applicable/allowed.

Response:
```javascript
{ message: 'Your message was not sent because you are sending messages too quickly' }
```

#### Usage
```javascript
Bot.on('error', err => ... )
```

#### Example Response
```javascript
{ message: 'Some error happened in the IRC channel' }
```

### `close - ()`
This event is emitted when the irc connection is destroyed via the `Bot.close()` method.
#### Usage
```javascript
Bot.on('close', () => {
  console.log('closed bot irc connection')
})
```

## Methods
### `join(channel: String)`
Attempts to join a channel. If successful, emits the 'join' event.

#### Example
```javascript
Bot.on('join', channel => {
  console.log(`Bot joined ${channel}`)
})
Bot.join('channel2')
```

### `part(channel: String)`
Attempts to part from a channel. If successful, emits the 'part' event.

#### Example
```javascript
Bot.on('part', channel => {
  console.log(`Bot left ${channel}`)
})
Bot.part('channel2')
```

### `say(message: String, channel: []Channel, err: Callback)`
Send a message in the currently connected Twitch channel. `channels` parameter not needed when connected to a single channel. An optional callback is provided for validating if the message was sent correctly.

#### Example
```javascript
Bot.say('This is a message')

Bot.say('Pretend this message is over 500 characters', err => {
  sent: false,
  message: 'Exceeded PRIVMSG character limit (500)'
  ts: '2017-08-13T16:38:54.989Z'
})

// If connected to multiple channels
Bot.say('message to #channel1', 'channel1')
Bot.say('message to #channel2', 'channel2')
```

### `timeout(username: String, channel: []Channel, duration: int, reason: String)`
Timeout a user from the chat. `channels` parameter not needed when connected to a single channel. Default `duration` is 600 seconds. Optional `reason` message.

#### Example
```javascript
Bot.timeout('kritzware', 10)
// "kritzware was timed out for 10 seconds"

Bot.timeout('kritzware', 5, 'Using a banned word')
// "kritzware was timed out for 5 seconds, reason: 'Using a banned word'"

Bot.on('message', chatter => {
  if(chatter.message === 'xD') Bot.timeout(chatter.username, 10)
})
```

### `ban(username: String, reason: String)`
Permanently ban a user from the chat. `channels` parameter not needed when connected to a single channel. Optional `reason` message.

#### Example
```javascript
Bot.ban('kritzware')
// "kritzware is now banned from the room"

Bot.timeout('kritzware', 'Using a banned word')
// "kritzware is now banned from the room, reason: 'Using a banned word'"

Bot.on('message', chatter => {
  if(chatter.message === 'Ban me!') Bot.ban(chatter.username)
})
```

### `close()`
Closes the Twitch irc connection. Bot will be removed from the Twitch channel AND the irc server.

#### Example
```javascript
Bot.close()
```

## Running Tests
Running the test suite requires at least two twitch accounts, one moderator account and one normal account. The channel used must be the same - This is so timeout/ban methods can be tested with the mod account. Using these two accounts, set the following environment variables:
```javascript
TWITCHBOT_USERNAME=mod_username
TWITCHBOT_OAUTH=oauth:mod-oauth-token
TWITCHBOT_CHANNEL=mod_channel
TWITCHBOT_USERNAME_NON_MOD=non_mod_username
TWITCHBOT_OAUTH_NON_MOD=oauth:non-mod-oauth-token
TWITCHBOT_CHANNEL_NON_MOD=mod_channel
```
To run the tests (powered with [Mocha](https://mochajs.org/)), use the following command:
```bash
yarn test
```
