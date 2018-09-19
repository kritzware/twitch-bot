"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
class IRC {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.socket = new net_1.Socket();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.socket.setEncoding('utf8');
                this.socket.on('ready', () => resolve());
                this.socket.connect({
                    host: this.host,
                    port: this.port,
                });
            });
        });
    }
    write(message) {
        this.socket.write(`${message}\r\n`);
    }
    listen(callback) {
        this.socket.on('data', (chunk) => {
            const lines = chunk.split('\n:');
            for (const line of lines) {
                callback(line);
            }
        });
    }
    once(callback) {
        this.socket.once('data', (chunk) => {
            callback(chunk);
        });
    }
}
exports.default = IRC;
