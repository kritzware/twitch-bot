const sinon = require('sinon')
const expect = require('chai').expect

const ChannelManager = require('../lib/channelManager.js')

let channelManagerInstance = null
let sendMessageStub = null

describe('channelManager unit tests', function () {
  beforeEach((done) => {
    sendMessageStub = sinon.stub()
    channelManagerInstance = new ChannelManager(sendMessageStub)
    done()
  })

  it('cannot be instantiated without a sendMessageFunction - throws Error', () => {
    try {
      const instance = new ChannelManager()
    } catch (e) {
      console.log(e.message)
      expect(e.message).to.equal('sendMessageFunc parameter not a function.')
    }
  })

  it('returns empty array for .channels() after instantiation', () => {
    expect(channelManagerInstance.channels()).to.be.empty
  })

  it('creates a channel if .join is called', () => {
    channelManagerInstance.join('#testchannel')
    expect(channelManagerInstance.channels()).to.have.members(['#testchannel'])
  })

  it('creates two separate channels if .join is called twice with different channel names', () => {
    channelManagerInstance.join('#testchannel')
    channelManagerInstance.join('#testchannel2')
    expect(channelManagerInstance.channels()).to.have.members(['#testchannel', '#testchannel2'])
  })

  it('does not create a channel more than once if .join is called with same arguments', () => {
    channelManagerInstance.join('#testchannel')
    channelManagerInstance.join('#testchannel2')
    expect(channelManagerInstance.channels()).to.have.members(['#testchannel', '#testchannel2'])
  })

  it('removes a channel if .part() is called with an existing channel name', () => {
    channelManagerInstance.join('#testchannel')
    channelManagerInstance.join('#testchannel2')
    channelManagerInstance.part('#testchannel')

    expect(channelManagerInstance.channels()).to.have.members(['#testchannel2'])
  })

  it('does not fail if .part() is called with a non existing channel name and returns false', () => {
    channelManagerInstance.join('#testchannel')
    expect(channelManagerInstance.part('#testchannel123')).to.equal(false)

    expect(channelManagerInstance.channels()).to.have.members(['#testchannel'])
  })
})
