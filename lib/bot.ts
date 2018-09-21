import { EventEmitter } from 'events'

/* IRC */
import IRC from './irc'
import ChannelManager from './channelManager'

/* Types + Interfaces */
import { Channel, Chunk, Message, RoomModerationCommand } from './types'
import { Options, SayOptions } from './interfaces'

/* Utils */
import { formatPrivMsg, formatJoin } from './parser'
import { argError, getEvent } from './utils'

/** @constant */
const HOST = 'irc.chat.twitch.tv'
const PORT = 6667

/**
 * @class
 * @name TwitchBot
 * @description Creates a new Twitch bot instance
 */
class TwitchBot extends EventEmitter {
  private options: Options
  private client: IRC
  private channelManager: ChannelManager

  constructor(options: Options) {
    super()
    if (!options.username) {
      argError('Expected "username" in TwitchBot constructor')
    }
    if (!options.oauth) {
      argError('Expected "oauth" in TwitchBot constructor')
    }
    this.options = options
    this.client = new IRC(HOST, PORT)
    this.channelManager = new ChannelManager(this.options.channels, this.client)
  }

  /**
   * @name connect
   * @public
   * @method
   * @description Creates a Socket connection with Twitch IRC
   */
  public async connect(): Promise<void> {
    await this.client.connect()
    this.listen()
  }

  /**
   * @name say
   * @public
   * @method
   * @description Sends a message to a channel chat room
   */
  public say(message: Message, options?: SayOptions): void {
    let channelToSend = this.channelManager.default()
    const multiChannel = this.channelManager.count() > 1

    if (!options && multiChannel) {
      argError(`Must specify options.channel in say() when connected to multiple channels`)
    }
    if (options) {
      const { channel, coloured } = options

      if (multiChannel && !channel) {
        argError(`Must specify options.channel in say() when connected to multiple channels`)
      }
      if (multiChannel && channel && this.channelManager.checkExists(channel)) {
        channelToSend = channel
      }
      if (coloured) {
        message = `/me ${message}`
      }
    }
    if (!this.options.mute) {
      this.client.write(`PRIVMSG ${channelToSend} :${message}`)
    }
  }

  /**
   * @name setRoomMode
   * @public
   * @method
   * @description Sets the room to a specified mode (RoomModerationCommand)
   */
  public setRoomMode(mode: RoomModerationCommand, options?: SayOptions): void {
    if (!mode) {
      argError(`Expected "mode" to be one of ${Object.keys(RoomModerationCommand)}`)
    }
    this.say(`/${mode}`, options ? options : undefined)
  }

  /**
   * @name getModerators
   * @public
   * @method
   * @description
   */
  // TODO: Fix this no that sayWithResponse is gone
  public async getModerators(): Promise<string[]> {
    // await this.sayWithResponse('/mods', this.options.channels[0])
    // const mods = (<string>this.lastChunk).split('are: ')[1]
    // return mods.split(', ')
    return []
  }

  /**
   * @name listen
   * @private
   * @method
   * @description Activates event listeners upon successfully connecting to the IRC server
   */
  private listen() {
    this.client.listen((data: Chunk) => {
      try {
        const event = getEvent(data)
        this.parse(event, data)
      } catch (err) {
        console.error('Failed parsing chunk:\n', JSON.stringify(data))
      }
    })
    this.sendCredentials()
  }

  /**
   * @name parse
   * @private
   * @method
   * @description Calls the corresponding parse method for the specified event
   */
  private parse(event: string | number, data: Chunk) {
    switch (event) {
      case 'PRIVMSG':
        const message = formatPrivMsg(data)
        this.emit('message', message)
        break
      case 'JOIN':
        const channel = formatJoin(data)
        this.channelManager.setAsConnected(channel)
        this.emit('join', channel)
        break
      case 'PING':
        this.ping()
        break
      default:
        console.log(`No parse handler for event "${event}":\n --> ${JSON.stringify(data)}\n`)
    }
  }

  private sendCredentials() {
    this.client.write(`PASS ${this.options.oauth}`)
    this.client.write(`NICK ${this.options.username}`)
    this.client.write('CAP REQ :twitch.tv/tags')
    this.client.write('CAP REQ :twitch.tv/membership')
    this.client.write('CAP REQ :twitch.tv/commands')
    this.channelManager.joinAll()
  }

  private ping() {
    this.client.write('PONG :tmi.twitch.tv')
  }
}

export = TwitchBot
