/* global describe it beforeEach */
const sinon = require('sinon')

const Channel = require('../lib/channel')
const expect = require('chai').expect

let channelInstance = null
let writeStub = null

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

  it('should allow sending more messages after trackInterval has been called', () => {
    let count = 0

    writeStub.callsFake(function (data, encoding, cb) {
      count++
    })

    for (let i = 0; i < 25; i++) {
      channelInstance.sendMessage('testmessage')
    }

    expect(count).to.equal(20)
    expect(channelInstance.messageQueue.length).to.equal(5)

    for(let i = 0; i<31; i++){
      channelInstance.trackInterval()
    }
  /*  for (let i = 0; i < 5; i++) {
      channelInstance.sendMessage('testmessage2')
    }*/
    expect(count).to.equal(25)
    expect(channelInstance.messageQueue.length).to.equal(0)
  })

  it('sets 20 messages per 30 seconds as default rate limitation', () => {

    expect(channelInstance.limit).to.equal(20)
    expect(channelInstance.limitTimePeriod).to.equal(30)
  })

  it('sets 100 messages per 30 seconds as \'MOD\' rate limitation', () => {
    channelInstance.setSelfStatus('MOD')
    expect(channelInstance.limit).to.equal(100)
    expect(channelInstance.limitTimePeriod).to.equal(30)
  })
})
