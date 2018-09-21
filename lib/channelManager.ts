import IRC from './irc'
import { Channel, Chunk } from './types'
import { getEvent } from './utils'

interface ConnectedChannels {
  [index: string]: boolean
}

export default class ChannelManager {
  private channels: ConnectedChannels
  private client: IRC

  constructor(channels: Channel[], client: IRC) {
    this.channels = {}
    for (const channel of channels) {
      this.channels[channel] = false
    }
    this.client = client
  }

  public join(channel: Channel) {
    this.client.writeWithResponse(`JOIN ${channel}`)
  }

  public joinAll() {
    for (const channel of Object.keys(this.channels)) {
      this.join(channel)
    }
  }

  public setAsConnected(channel: Channel) {
    this.channels[channel] = true
  }

  public checkExists(channel: Channel): boolean {
    if (!this.channels.hasOwnProperty(channel)) {
      console.error(`ChannelManager: Not currently connected to channel #${channel}`)
      return false
    }
    return true
  }

  public default(): Channel | undefined {
    const channels = Object.keys(this.channels)
    if (channels.length === 1) {
      return channels[0]
    }
  }

  public count(): number {
    return Object.keys(this.channels).length
  }
}
