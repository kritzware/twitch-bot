"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelManager {
    constructor(channels, client) {
        this.channels = {};
        for (const channel of channels) {
            this.channels[channel] = false;
        }
        this.client = client;
    }
    join(channel) {
        this.client.writeWithResponse(`JOIN ${channel}`);
    }
    joinAll() {
        for (const channel of Object.keys(this.channels)) {
            this.join(channel);
        }
    }
    setAsConnected(channel) {
        this.channels[channel] = true;
    }
    checkExists(channel) {
        if (!this.channels.hasOwnProperty(channel)) {
            console.error(`ChannelManager: Not currently connected to channel #${channel}`);
            return false;
        }
        return true;
    }
    default() {
        const channels = Object.keys(this.channels);
        if (channels.length === 1) {
            return channels[0];
        }
    }
    count() {
        return Object.keys(this.channels).length;
    }
}
exports.default = ChannelManager;
