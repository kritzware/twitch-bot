import { Chunk } from './types';
export default class IRC {
    private readonly host;
    private readonly port;
    private socket;
    private lastChunk;
    private listenForChunk;
    constructor(host: string, port: number);
    connect(): Promise<any>;
    write(message: string, callback?: () => void): void;
    writeWithResponse(message: string): Promise<Chunk>;
    listen(callback: (data: Chunk) => void): void;
}
