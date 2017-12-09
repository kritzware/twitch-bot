const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')
const utils = require('./utils')

describe('TwitchBot()', () => {
  it('should create a new Bot instance', () => {
    const bot = utils.createBotInstance({})
    expect(bot).to.be.an.instanceOf(TwitchBot)
    bot.close()
  })
  it('should throw an error if missing required arguments', () => {
    try {
      const bot = new TwitchBot({})
    } catch(err) {
      expect(err.message).to.equal('missing or invalid required arguments')
    }
  })

  it('should throw an error if channels is not an array', () => {
    try {
      const bot = new TwitchBot({channels: '#channel'})
    } catch(err) {
      expect(err.message).to.equal('missing or invalid required arguments')
    }
  })

  it('should normalize the channel name', () => {
    const bot = utils.createBotInstance({ channels: ['Channel'] })
    const bot2 = utils.createBotInstance({ channels: ['#ChanneL'] })
    expect(bot.channels[0]).to.equal('#channel')
    expect(bot2.channels[0]).to.equal('#channel')
    bot.close()
    bot2.close()
  })
  it('should emit a join event when connecting to twitch irc', done => {
    const bot = utils.createBotInstance({})
    bot.on('join', () => {
      bot.close()
      done()
    })
  })
  it('should emit an error when twitch authentication fails', done => {
    const bot = utils.createBotInstance({ username: 'kappa_123', oauth: 'oauth:123kappa' })
    bot.on('error', err => {
      expect(err.message).to.equal('Login authentication failed')
      bot.close()
      done()
    })
  })
  it('should emit an error when oauth format is invalid', done => {
    const bot = utils.createBotInstance({ oauth: 'oauthxD:kappa123' })
    bot.on('error', err => {
      expect(err.message).to.equal('Improperly formatted auth')
      bot.close()
      done()
    })
  })
})

describe('say()', () => {
  it('should send a message in the channel', done => {
    const receiver = utils.createBotInstance({})
    const sender = utils.createBotInstance({})
    receiver.on('join', () => {
      receiver.on('message', chatter => {

        expect(chatter.message).to.equal('PogChamp')
        receiver.close()
        sender.close()
        done()
      })
    })

    sender.on('join', () => {
        setTimeout(() => {
          sender.say('PogChamp',sender.channels[0])
        },1000)
    })


  })
  it('should fail when the message to send is over 500 characters', done => {
    const bot = utils.createBotInstance({})
    bot.on('join', () => {
      bot.say(samples.PRIVMSG.long, bot.channels[0], err => {
        expect(err.sent).to.equal(false)
        expect(err.message).to.equal('Exceeded PRIVMSG character limit (500)')
        bot.close()
        done()
      })
    })
  })
  afterEach(done => setTimeout(() => done(), 2000))
})

describe('close()', () => {
  it('should close the irc connection and emit a close event', done => {
    const bot = utils.createBotInstance({})
    bot.on('join', () => {
      bot.on('close', () => {
        expect(bot.irc.destroyed).to.equal(true)
        done()
      })
      bot.close()
    })
  })
  afterEach(done => setTimeout(() => done(), 2000))
})

describe('timeout()', () => {
  it('should timeout a user in the twitch channel', done => {
    const bot = utils.createBotInstance({})
    const pleb = utils.createNonModBotInstance({})

    const BAN_DURATION = 2
    const BAN_REASON = 'Test timeout message 1'
    const TARGET_USERNAME = utils.NON_MOD_CONFIG.USERNAME
    // Add timestamp to avoid message rate limits
    const TRIGGER_MESSAGE = 'Timeout trigger message ' + new Date()

    bot.on('join', () => {
      bot.on('timeout', event => {
        expect(event.target_username).to.equal(TARGET_USERNAME)
        expect(event.ban_duration).to.equal(BAN_DURATION)
        expect(event.ban_reason).to.equal(BAN_REASON)
        bot.close()
        pleb.close()
        done()
      })
      bot.on('message', chatter => {
        if(chatter.message === TRIGGER_MESSAGE) {
          bot.timeout(chatter.username,bot.channels[0],BAN_DURATION, BAN_REASON)
        }
      })
    })
    pleb.on('join', () => {
      pleb.say(TRIGGER_MESSAGE, pleb.channels[0])
    })
  })
  afterEach(done => setTimeout(() => done(), 2000))
})

describe('ban()', () => {
  it('should ban a user in the twitch channel', done => {
    const bot = utils.createBotInstance({})
    const pleb = utils.createNonModBotInstance({})

    const BAN_REASON = 'Test ban message 1'
    const TARGET_USERNAME = utils.NON_MOD_CONFIG.USERNAME
    // Add timestamp to avoid message rate limits
    const TRIGGER_MESSAGE = 'Ban trigger message ' + new Date()

    bot.on('join', () => {
      bot.on('ban', event => {
        expect(event.target_username).to.equal(TARGET_USERNAME)
        expect(event.ban_reason).to.equal(BAN_REASON)
        bot.say('/unban ' + pleb.username, pleb.channels[0])
        bot.close()
        pleb.close()
        done()
      })
      bot.on('message', chatter => {
        if(chatter.message === TRIGGER_MESSAGE) {
          bot.ban(chatter.username, bot.channels[0], BAN_REASON)
        }
      })
    })
    pleb.on('join', () => {
      pleb.say(TRIGGER_MESSAGE, pleb.channels[0])
    })
  })
  afterEach(done => setTimeout(() => done(), 2000))
})

/* Events */
require('./events')
