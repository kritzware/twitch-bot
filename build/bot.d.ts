/// <reference types="node" />
import { EventEmitter } from 'events';
import { Message, RoomModerationCommand } from './types';
import { Options, SayOptions } from './interfaces';
declare class TwitchBot extends EventEmitter {
    private options;
    private client;
    private channelManager;
    constructor(options: Options);
    connect(): Promise<void>;
    say(message: Message, options?: SayOptions): void;
    setRoomMode(mode: RoomModerationCommand, options?: SayOptions): void;
    getModerators(): Promise<string[]>;
    private listen;
    private parse;
    private sendCredentials;
    private ping;
}
export = TwitchBot;
