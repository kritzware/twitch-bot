const sinon = require('sinon')

const Channel = require('../lib/channel')
const expect = require('chai').expect

let channelInstance = null
const samples = require('./samples')

describe('emulated IO tests', function () {
  beforeEach((done) => {
    writeStub = sinon.stub()
    channelInstance = new Channel('#testchannel', writeStub)
    done()
  })

  it('cannot be instantiated without a sendMessageFunction - throws Error', () => {
    try {
      const instance = new Channel('#testchannel')
    } catch (e) {
      expect(e.message).to.equal('sendMessageFunc parameter not a function.')
    }
  })

  it('should only send 20 messages because of rate limitation', () => {
    let count = 0

    writeStub.callsFake(function (data, encoding, cb) {
      count++
    })

    for (let i = 0; i < 25; i++) {
      channelInstance.sendMessage('testmessage')
    }

    expect(count).to.equal(20)
    expect(channelInstance.messageQueue.length).to.equal(5)
  })
})
