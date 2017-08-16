const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')

const CONFIG = {
  USERNAME: process.env.TWITCHBOT_USERNAME,
  OAUTH: process.env.TWITCHBOT_OAUTH,
  CHANNEL: process.env.TWITCHBOT_CHANNEL
}

function createBotInstance({ username, oauth, channel }) {
  return new TwitchBot({
    username: username || CONFIG.USERNAME,
    oauth: oauth || CONFIG.OAUTH,
    channel: channel || CONFIG.CHANNEL
  })
}

describe('TwitchBot()', () => {
  it('should create a new Bot instance', () => {
    const bot = createBotInstance({})
    expect(bot).to.be.an.instanceOf(TwitchBot)
  })
  it('should throw an error when missing required arguments', () => {
    try {
      const bot = new TwitchBot({})
    } catch(err) {
      expect(err.message).to.equal('missing required arguments')
    }
  })
  it('should normalize the channel name', () => {
    const bot = createBotInstance({ channel: 'Channel' })
    const bot2 = createBotInstance({ channel: '#ChanneL' })
    expect(bot.channel).to.equal('#channel')
    expect(bot2.channel).to.equal('#channel')
  })
  it('should emit a join event when connecting to twitch irc', done => {
    const bot = createBotInstance({})
    bot.on('join', () => done())
  })
  it('should emit an error when twitch authentication fails', done => {
    const bot = createBotInstance({ username: 'kappa_123', oauth: 'oauth:123kappa' })
    bot.on('error', err => {
      expect(err.message).to.equal('Login authentication failed')
      done()
    })
  })
  it('should emit an error when oauth format is invalid', done => {
    const bot = createBotInstance({ oauth: 'oauthxD:kappa123' })
    bot.on('error', err => {
      expect(err.message).to.equal('Improperly formatted auth')
      done()
    })
  })
})

describe('say()', () => {
  it('should send a message in the channel', done => {
    const reciever = createBotInstance({})
    const sender = createBotInstance({})
    reciever.on('join', () => {
      reciever.on('message', chatter => {
        expect(chatter.message).to.equal('PogChamp')
        done()
      })
    })
    sender.on('join', () => {
      sender.say('PogChamp')
    })
  })
  it('should fail when the message to send is over 500 characters', done => {
    const bot = createBotInstance({})
    bot.on('join', () => {
      bot.say(samples.PRIVMSG.long, err => {
        expect(err.sent).to.equal(false)
        expect(err.message).to.equal('Exceeded PRIVMSG character limit (500)')
        done()
      })
    })
  })
})