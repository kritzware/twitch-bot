/// <reference types="node" />
import { EventEmitter } from 'events';
declare type Channel = string;
interface Options {
    readonly username: string;
    readonly oauth: string;
    channels: Channel[];
    mute?: boolean;
}
declare class TwitchBot extends EventEmitter {
    private options;
    private socket;
    constructor(options: Options);
    connect(): Promise<void>;
    say(message: string, channelName: string): void;
    private listen;
    private sendCredentials;
    private joinChannels;
    private join;
    private write;
}
export = TwitchBot;
