"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const events_1 = require("events");
const net_1 = require("net");
const HOST = 'irc.chat.twitch.tv';
const PORT = 6667;
class TwitchBot extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (!options.username) {
            argError('Missing required username for bot account');
        }
        if (!options.oauth) {
            argError('Expected oauth token for bot account e.g. ');
        }
        this.options = options;
        this.socket = new net_1.Socket();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => {
                this.socket.setEncoding('utf8');
                this.socket.on('ready', () => resolve());
                this.socket.connect({
                    host: HOST,
                    port: PORT,
                });
            });
            this.listen();
        });
    }
    say(message, channelName) {
        if (!channelName) {
            channelName = this.options.channels[0];
        }
        if (!this.options.mute) {
            this.write(`PRIVMSG ${channelName} :${message}`);
        }
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendCredentials();
            this.socket.on('data', (data) => {
                if (data.match(/tmi.twitch.tv PRIVMSG #(.*) :/)) {
                    console.log('MESSAGE!', data);
                }
            });
        });
    }
    sendCredentials() {
        this.write(`PASS ${this.options.oauth}`);
        this.write(`NICK ${this.options.username}`);
        this.joinChannels();
        this.write('CAP REQ :twitch.tv/tags');
        this.write('CAP REQ :twitch.tv/membership');
        this.write('CAP REQ :twitch.tv/commands');
    }
    joinChannels() {
        for (const channel of this.options.channels) {
            this.join(channel);
        }
    }
    join(channelName) {
        this.write(`JOIN ${channelName}`);
    }
    write(message) {
        this.socket.write(`${message}\r\n`);
    }
}
function argError(message) {
    throw new Error(message);
}
module.exports = TwitchBot;
