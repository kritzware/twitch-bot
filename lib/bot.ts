import { EventEmitter } from 'events'

/* IRC */
import IRC from './irc'

/* Types + Interfaces */
import { Channel, Chunk, Message, RoomModerationCommand } from './types'
import { Options, SayOptions } from './interfaces'

/* Utils */
import { formatPrivMsg } from './parser'

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

  private lastChunk: Chunk | undefined

  constructor(options: Options) {
    super()

    /* Check for required arguments */
    if (!options.username) {
      argError('Expected username for bot account')
    }
    if (!options.oauth) {
      argError('Expected oauth token for bot account')
    }

    /* Set default options */
    this.options = options
    this.client = new IRC(HOST, PORT)
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
    let channelName = this.options.channels[0]
    if (options) {
      if (options.channel) {
        channelName = options.channel
      }
      if (options.colored) {
        message = `/me ${message}`
      }
    }
    if (!this.options.mute) {
      this.client.write(`PRIVMSG ${channelName} :${message}`)
    }
  }

  /**
   * @name setRoomMode
   * @public
   * @method
   * @param {RoomModerationCommand} mode
   * @memberof TwitchBot
   */
  public setRoomMode(mode: RoomModerationCommand): void {
    if (!mode) {
      argError(`Expected "mode" to be one of ${Object.keys(RoomModerationCommand)}`)
    }
    this.say(`/${mode}`)
  }

  public getModerators(): string[] {
    this.client.once((data: Chunk) => {
      console.log(1, data)
    })
    this.say('/mods')
    return []
  }

  /**
   * @name listen
   * @private
   * @method
   * @description Activates event listeners upon successfully connecting to the IRC server
   */
  private listen() {
    this.sendCredentials()
    this.client.listen((data: Chunk) => {
      this.lastChunk = data
      try {
        const event = getEvent(data)
        this.parse(event, data)
      } catch (err) {
        console.error('Failed parsing chunk:\n', JSON.stringify(data))
      }
    })
  }

  /**
   * @name parse
   * @private
   * @method
   * @description Calls the corresponding parse method for the specified event
   */
  private parse(event: string, data: Chunk) {
    switch (event) {
      case 'PRIVMSG':
        const message = formatPrivMsg(data)
        this.emit('message', message)
        break
      default:
        console.log(`No parse handler for event "${event}":\n --> ${JSON.stringify(data)}\n`)
    }
  }

  private sendCredentials() {
    this.client.write(`PASS ${this.options.oauth}`)
    this.client.write(`NICK ${this.options.username}`)
    this.joinChannels()
    this.client.write('CAP REQ :twitch.tv/tags')
    this.client.write('CAP REQ :twitch.tv/membership')
    this.client.write('CAP REQ :twitch.tv/commands')
  }

  private joinChannels() {
    for (const channel of this.options.channels) {
      this.join(channel)
    }
  }

  private join(channelName: string) {
    this.client.write(`JOIN ${channelName}`)
  }
}

function argError(message: string) {
  throw new Error(message)
}

function getEvent(data: Chunk) {
  const isCommand: RegExp = /(?<=tmi.twitch.tv|jtv) ([0-9]|[A-Z])\w+/
  const matches: RegExpMatchArray | null = data.match(isCommand)
  const match = (<any>matches)[0].trim()
  if (!isNaN(match)) {
    return +match
  }
  return match
}

export = TwitchBot
