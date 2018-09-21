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
const channelManager_1 = __importDefault(require("./channelManager"));
const types_1 = require("./types");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const HOST = 'irc.chat.twitch.tv';
const PORT = 6667;
class TwitchBot extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.username) {
            utils_1.argError('Expected "username" in TwitchBot constructor');
        }
        if (!options.oauth) {
            utils_1.argError('Expected "oauth" in TwitchBot constructor');
        }
        this.options = options;
        this.client = new irc_1.default(HOST, PORT);
        this.channelManager = new channelManager_1.default(this.options.channels, this.client);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.listen();
        });
    }
    say(message, options) {
        let channelToSend = this.channelManager.default();
        const multiChannel = this.channelManager.count() > 1;
        if (!options && multiChannel) {
            utils_1.argError(`Must specify options.channel in say() when connected to multiple channels`);
        }
        if (options) {
            const { channel, coloured } = options;
            if (multiChannel && !channel) {
                utils_1.argError(`Must specify options.channel in say() when connected to multiple channels`);
            }
            if (multiChannel && channel && this.channelManager.checkExists(channel)) {
                channelToSend = channel;
            }
            if (coloured) {
                message = `/me ${message}`;
            }
        }
        if (!this.options.mute) {
            this.client.write(`PRIVMSG ${channelToSend} :${message}`);
        }
    }
    setRoomMode(mode, options) {
        if (!mode) {
            utils_1.argError(`Expected "mode" to be one of ${Object.keys(types_1.RoomModerationCommand)}`);
        }
        this.say(`/${mode}`, options ? options : undefined);
    }
    getModerators() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    listen() {
        this.client.listen((data) => {
            try {
                const event = utils_1.getEvent(data);
                this.parse(event, data);
            }
            catch (err) {
                console.error('Failed parsing chunk:\n', JSON.stringify(data));
            }
        });
        this.sendCredentials();
    }
    parse(event, data) {
        switch (event) {
            case 'PRIVMSG':
                const message = parser_1.formatPrivMsg(data);
                this.emit('message', message);
                break;
            case 'JOIN':
                const channel = parser_1.formatJoin(data);
                this.channelManager.setAsConnected(channel);
                this.emit('join', channel);
                break;
            case 'PING':
                this.ping();
                break;
            default:
                console.log(`No parse handler for event "${event}":\n --> ${JSON.stringify(data)}\n`);
        }
    }
    sendCredentials() {
        this.client.write(`PASS ${this.options.oauth}`);
        this.client.write(`NICK ${this.options.username}`);
        this.client.write('CAP REQ :twitch.tv/tags');
        this.client.write('CAP REQ :twitch.tv/membership');
        this.client.write('CAP REQ :twitch.tv/commands');
        this.channelManager.joinAll();
    }
    ping() {
        this.client.write('PONG :tmi.twitch.tv');
    }
}
module.exports = TwitchBot;
