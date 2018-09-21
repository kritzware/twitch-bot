import IRC from './irc';
import { Channel } from './types';
export default class ChannelManager {
    private channels;
    private client;
    constructor(channels: Channel[], client: IRC);
    join(channel: Channel): void;
    joinAll(): void;
    setAsConnected(channel: Channel): void;
    checkExists(channel: Channel): boolean;
    default(): Channel | undefined;
    count(): number;
}
