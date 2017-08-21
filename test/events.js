const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')
const utils = require('./utils')

describe('Events', () => {
  let sender, reciever

  beforeEach(done => {
    let conn_1 = false, conn_2 = false
    sender = utils.createNonModBotInstance({})
    reciever = utils.createBotInstance({})
    sender.on('join', () => conn_1 = true)
    reciever.on('join', () => conn_2 = true)

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
      reciever.on('timeout', event => {
        expect(event.ban_duration).to.equal(1)
        expect(event.ban_reason).to.be.null
        expect(event.type).to.equal('timeout')
        done()
      })
      reciever.on('message', chatter => {
        if(chatter.message === 'event-timeout') {
          reciever.timeout(chatter.username, 1)
        }
      })
      sender.say('event-timeout')
    })
  })

  describe('"ban"', () => {
    it('should emit when a user is banned', done => {
      reciever.on('ban', event => {
        expect(event).to.not.have.keys('ban_duration')
        expect(event.ban_reason).to.be.null
        expect(event.type).to.equal('ban')
        reciever.say('/unban ' + sender.username)
        done()
      })
      reciever.on('message', chatter => {
        if(chatter.message === 'event-ban') {
          reciever.ban(chatter.username)
        }
      })
      sender.say('event-ban')
    })
  })

  afterEach(done => {
    sender.close()
    reciever.close()
    done()
  })

})