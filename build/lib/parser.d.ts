export interface PrivMsg {
    badges?: Badges;
    bits?: number;
    color: string;
    displayName: string;
    id: string;
    emotes?: string;
    mod: boolean;
    roomId: number;
    subscriber: boolean;
    tmiSentTs: number;
    turbo: boolean;
    userId: number;
    channel: string;
    message: string;
}
export interface Badges {
    admin?: number;
    bits?: number;
    broadcaster?: number;
    globalMod?: number;
    moderator?: number;
    subscriber?: number;
    staff?: number;
    turbo?: number;
    premium?: number;
}
export declare function formatPrivMsg(chunk: string): PrivMsg;
