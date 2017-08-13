const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')

const CONFIG = {
  USERNAME: process.env.TWITCHBOT_USERNAME,
  OAUTH: process.env.TWITCHBOT_OAUTH,
  CHANNEL: process.env.TWITCHBOT_CHANNEL
}

describe('TwitchBot()', () => {
  it('should create a new Bot instance', () => {
    const bot = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: CONFIG.CHANNEL
    })
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
    const bot = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: 'Channel'
    })
    const bot2 = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: '#ChanneL'
    })
    expect(bot.channel).to.equal('#channel')
    expect(bot2.channel).to.equal('#channel')
  })
  it('should emit a join event when connecting to twitch irc', done => {
    const bot = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: CONFIG.CHANNEL
    })
    bot.on('join', () => done())
  })
  it('should emit an error when twitch authentication fails', done => {
    const bot = new TwitchBot({
      username: 'kappa_123',
      oauth: 'oauth:123kappa',
      channel: CONFIG.CHANNEL
    })
    bot.on('error', err => done())
  })
})

describe('say()', () => {
  it('should send a message in the channel', done => {
    const reciever = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: CONFIG.CHANNEL
    })
    const sender = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: CONFIG.CHANNEL
    })
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
    const bot = new TwitchBot({
      username: CONFIG.USERNAME,
      oauth: CONFIG.OAUTH,
      channel: CONFIG.CHANNEL
    })
    bot.on('join', () => {
      bot.say(samples.PRIVMSG.long, err => {
        expect(err.sent).to.equal(false)
        expect(err.message).to.equal('Exceeded PRIVMSG character limit (500)')
        done()
      })
    })
  })
})