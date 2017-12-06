const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')
const utils = require('./utils')

describe('Events', () => {
  let sender, receiver

  beforeEach(done => {
    let conn_1 = false, conn_2 = false
    sender = utils.createNonModBotInstance({})
    receiver = utils.createBotInstance({})
    sender.on('join', () => conn_1 = true)
    receiver.on('join', () => conn_2 = true)

    const connect = setInterval(() => {
      if(conn_1 && conn_2) {
        clearInterval(connect)
        setTimeout(function() {
          done()
        }, 3000)
      }
    }, 500)
  })

  describe('"timeout"', () => {
    it('should emit when a user is timed out', done => {
      receiver.on('timeout', event => {
        expect(event.ban_duration).to.equal(1)
        expect(event.ban_reason).to.be.null
        expect(event.type).to.equal('timeout')
        done()
      })
      receiver.on('message', chatter => {
        if(chatter.message === 'event-timeout') {
          receiver.timeout(chatter.username, receiver.channels[0], 1)
        }
      })
      sender.say('event-timeout', sender.channels[0])
    })
  })

  describe('"ban"', () => {
    it('should emit when a user is banned', done => {
      receiver.on('ban', event => {
        expect(event).to.not.have.keys('ban_duration')
        expect(event.ban_reason).to.be.null
        expect(event.type).to.equal('ban')
        receiver.say('/unban ' + sender.username, receiver.channels[0])
        done()
      })
      receiver.on('message', chatter => {
        if(chatter.message === 'event-ban') {
          receiver.ban(chatter.username, receiver.channels[0])
        }
      })
      sender.say('event-ban', sender.channels[0])
    })
  })

  afterEach(done => {
    sender.close()
    receiver.close()
    done()
  })

})
