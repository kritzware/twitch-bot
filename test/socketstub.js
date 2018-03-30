const sinon = require('sinon')

const TwitchBot = require('../index')
const {expect} = require('chai')

const connectStub = TwitchBot.prototype._connect.displayName === '_connect'
  ? TwitchBot.prototype._connect
  : sinon.stub(TwitchBot.prototype, '_connect')
let botInstance = null
let botIrcWriteStub = null

const samples = require('./samples')
const USERNAME = 'test'

describe('emulated IO tests', function () {
  beforeEach((done) => {
    botInstance = new TwitchBot({
      username: USERNAME,
      oauth: 'oauth:123abc',
      channels: ['testchannel']
    })

    botIrcWriteStub = sinon.stub(botInstance.irc, 'write')
    connectStub.callsFake(function () {
      this.emit('connect')
    })
    botInstance.afterConnect()
    done()
  })
  it('should handle error if invalid auth', function (done) {
    botInstance.on('error', (err) => {
      expect(err.message).to.equal('Login authentication failed')
      done()
    })
    botInstance.irc.emit('data', 'Login authentication failed\r\n')
  })

  it('should handle error if improperly formatted auth', function (done) {
    botInstance.on('error', (err) => {
      expect(err.message).to.equal('Improperly formatted auth')
      done()
    })
    botInstance.irc.emit('data', 'Improperly formatted auth\r\n')
  })

  it('should handle a channel message', function (done) {
    botInstance.on('message', (chatter) => {
      expect(chatter).to.eql(samples.PRIVMSG.expected)
      done()
    })
    botInstance.irc.emit('data', samples.PRIVMSG.raw)
  })

  it('should handle a subscription message', function (done) {
    botInstance.on('subscription', (chatter) => {
      expect(chatter).to.eql(samples.USERNOTICE.subscription_expected)
      done()
    })
    botInstance.irc.emit('data', samples.USERNOTICE.subscription_raw)
  })

  it('should handle a timeout message', function (done) {
    botInstance.on('timeout', (chatter) => {
      expect(chatter).to.eql(samples.CLEARCHAT.timeout_expected)
      done()
    })
    botInstance.irc.emit('data', samples.CLEARCHAT.timeout_raw)
  })

  it('should handle a ban message', function (done) {
    botInstance.on('ban', (chatter) => {
      expect(chatter).to.eql(samples.CLEARCHAT.ban_expected)
      done()
    })
    botInstance.irc.emit('data', samples.CLEARCHAT.ban_raw)
  })

  it('should handle a self-channel-join message', function (done) {
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel`

    botInstance.on('join', channel => {
      expect(channel).to.eql('#testchannel')
      expect(botInstance.channels).to.eql(['#testchannel'])
      done()
    })
    botInstance.irc.emit('data', JOIN_MESSAGE)
  })

  it('should handle a self-channel-join message with \\r\\n', function (done) {
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel\r\n`

    botInstance.on('join', (chatter) => {
      expect(chatter).to.eql('#testchannel')
      expect(botInstance.channels).to.eql(['#testchannel'])
      done()
    })
    botInstance.irc.emit('data', JOIN_MESSAGE)
  })

  it('should handle a self-channel-part message', function (done) {
    const PART_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv PART #testchannel`

    botInstance.on('part', (chatter) => {
      expect(chatter).to.eql('#testchannel')
      expect(botInstance.channels).to.eql([])
      done()
    })
    botInstance.channels = ['#testchannel']
    botInstance.irc.emit('data', PART_MESSAGE)
  })

  it('should handle a self-channel-part message with \\r\\n', function (done) {
    const PART_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv PART #testchannel\r\n`

    botInstance.on('part', (chatter) => {
      expect(chatter).to.eql('#testchannel')
      expect(botInstance.channels).to.eql([])
      done()
    })
    botInstance.channels = ['#testchannel']
    botInstance.irc.emit('data', PART_MESSAGE)
  })

  it('should reply to a server ping', function (done) {
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql('PONG :tmi.twitch.tv\r\n')
      done()
    })
    botInstance.irc.emit('data', 'PING :tmi.twitch.tv')
  })
})

describe('say()', () => {
  it('should send a message in the channel', done => {
    botInstance.irc.emit('data', `@${botInstance.username}.tmi.twitch.tv JOIN #testchannel`)
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql(`PRIVMSG ${botInstance.channels[0]} :testmessage\r\n`)
      done()
    })

    botInstance.say('testmessage', botInstance.channels[0])
  })
  it('should fail when the message to send is over 500 characters', done => {
    botInstance.say(samples.PRIVMSG.long, botInstance.channels[0], err => {
      expect(err.sent).to.equal(false)
      expect(err.message).to.equal('Exceeded PRIVMSG character limit (500)')
      done()
    })
  })
})

describe('join()', () => {
  it('should send properly formatted message to join a channel without a leading hashtag', done => {
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql(`JOIN #testchannel\r\n`)
      done()
    })
    botInstance.join('testchannel')
  })

  it('should send properly formatted message to join a channel with a leading hashtag', done => {
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql(`JOIN #testchannel\r\n`)
      done()
    })
    botInstance.join('#testchannel')
  })
})

describe('part()', () => {
  it('should send properly formatted message to part from a channel without a leading hashtag', done => {
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql(`PART #testchannel\r\n`)
      done()
    })
    botInstance.part('testchannel')
  })

  it('should send properly formatted message to part from a channel with a leading hashtag', done => {
    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      let received = botIrcWriteStub.args[botIrcWriteStub.callCount - 1][0]
      expect(received).to.eql(`PART #testchannel\r\n`)
      done()
    })
    botInstance.part('#testchannel')
  })
})
