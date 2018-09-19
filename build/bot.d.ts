/// <reference types="node" />
import { EventEmitter } from 'events';
import { Message, RoomModerationCommand } from './types';
import { Options, SayOptions } from './interfaces';
declare class TwitchBot extends EventEmitter {
    private options;
    private client;
    private lastChunk;
    constructor(options: Options);
    connect(): Promise<void>;
    say(message: Message, options?: SayOptions): void;
    setRoomMode(mode: RoomModerationCommand): void;
    getModerators(): string[];
    private listen;
    private parse;
    private sendCredentials;
    private joinChannels;
    private join;
}
export = TwitchBot;
