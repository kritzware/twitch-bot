import { EventEmitter } from 'events'
import { Socket } from 'net'
import { formatPrivMsg } from './parser'

/** @constant */
const HOST = 'irc.chat.twitch.tv'
const PORT = 6667

/** @type */
type Channel = string
type Chunk = string

/** @interface */
interface Options {
    readonly username: string
    readonly oauth: string
    channels: Channel[]
    mute?: boolean
}

/**
 * @class
 * @name TwitchBot
 * @description Creates a new Twitch bot instance
 */
class TwitchBot extends EventEmitter {
    private options: Options
    private socket: Socket

    constructor(options: Options) {
        super()

        /* Check for required arguments */
        if (!options.username) {
            argError('Missing required username for bot account')
        }
        if (!options.oauth) {
            argError('Missing required oauth token for bot account')
        }

        /* Set default options */
        this.options = options
        this.socket = new Socket()
    }

    /**
     * @name connect
     * @public
     * @method
     * @description Creates a Socket connection with Twitch IRC
     */
    public async connect(): Promise<void> {
        await new Promise(resolve => {
            this.socket.setEncoding('utf8')
            this.socket.on('ready', () => resolve())
            this.socket.connect({
                host: HOST,
                port: PORT,
            })
        })
        this.listen()
    }

    /**
     * @name say
     */
    public say(message: string, channelName: string): void {
        if (!channelName) {
            channelName = this.options.channels[0]
        }
        if (!this.options.mute) {
            this.write(`PRIVMSG ${channelName} :${message}`)
        }
    }

    /**
     * @name listen
     * @private
     * @method
     * @description Activates event listeners upon successfully connecting to the IRC server
     */
    private async listen() {
        this.sendCredentials()

        this.socket.on('data', (data: Chunk) => {
            // console.log('-- chunk --')
            // console.log(data)

            // if (data.includes('PRIVMSG')) {
            //     const message = formatPrivMsg(data)
            //     this.emit('message', message)
            // }

            if (data.match(/tmi.twitch.tv PRIVMSG #(.*) :/)) {
                console.log('MESSAGE!', data)
            }
        })
        // // // this.socket.on('close', has_error => {
        // // //     console.log({ has_error })
        // // // })
        // // this.socket.on('end', () => {
        // //     console.log('end')
        // // })
    }

    private sendCredentials() {
        this.write(`PASS ${this.options.oauth}`)
        this.write(`NICK ${this.options.username}`)
        this.joinChannels()
        this.write('CAP REQ :twitch.tv/tags')
        this.write('CAP REQ :twitch.tv/membership')
        this.write('CAP REQ :twitch.tv/commands')
    }

    private joinChannels() {
        for (const channel of this.options.channels) {
            this.join(channel)
        }
    }

    private join(channelName: string) {
        this.write(`JOIN ${channelName}`)
    }

    private write(message: string) {
        this.socket.write(`${message}\r\n`)
    }
}

function argError(message: string) {
    throw new Error(message)
}

export = TwitchBot
