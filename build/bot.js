"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = require("events");
const irc_1 = __importDefault(require("./irc"));
const types_1 = require("./types");
const parser_1 = require("./parser");
const HOST = 'irc.chat.twitch.tv';
const PORT = 6667;
class TwitchBot extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.username) {
            argError('Expected username for bot account');
        }
        if (!options.oauth) {
            argError('Expected oauth token for bot account');
        }
        this.options = options;
        this.client = new irc_1.default(HOST, PORT);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.listen();
        });
    }
    say(message, options) {
        let channelName = this.options.channels[0];
        if (options) {
            if (options.channel) {
                channelName = options.channel;
            }
            if (options.colored) {
                message = `/me ${message}`;
            }
        }
        if (!this.options.mute) {
            this.client.write(`PRIVMSG ${channelName} :${message}`);
        }
    }
    setRoomMode(mode) {
        if (!mode) {
            argError(`Expected "mode" to be one of ${Object.keys(types_1.RoomModerationCommand)}`);
        }
        this.say(`/${mode}`);
    }
    getModerators() {
        this.client.once((data) => {
            console.log(1, data);
        });
        this.say('/mods');
        return [];
    }
    listen() {
        this.sendCredentials();
        this.client.listen((data) => {
            this.lastChunk = data;
            try {
                const event = getEvent(data);
                this.parse(event, data);
            }
            catch (err) {
                console.error('Failed parsing chunk:\n', JSON.stringify(data));
            }
        });
    }
    parse(event, data) {
        switch (event) {
            case 'PRIVMSG':
                const message = parser_1.formatPrivMsg(data);
                this.emit('message', message);
                break;
            default:
                console.log(`No parse handler for event "${event}":\n --> ${JSON.stringify(data)}\n`);
        }
    }
    sendCredentials() {
        this.client.write(`PASS ${this.options.oauth}`);
        this.client.write(`NICK ${this.options.username}`);
        this.joinChannels();
        this.client.write('CAP REQ :twitch.tv/tags');
        this.client.write('CAP REQ :twitch.tv/membership');
        this.client.write('CAP REQ :twitch.tv/commands');
    }
    joinChannels() {
        for (const channel of this.options.channels) {
            this.join(channel);
        }
    }
    join(channelName) {
        this.client.write(`JOIN ${channelName}`);
    }
}
function argError(message) {
    throw new Error(message);
}
function getEvent(data) {
    const isCommand = /(?<=tmi.twitch.tv|jtv) ([0-9]|[A-Z])\w+/;
    const matches = data.match(isCommand);
    const match = matches[0].trim();
    if (!isNaN(match)) {
        return +match;
    }
    return match;
}
module.exports = TwitchBot;
