import { Chunk } from './types';
export default class IRC {
    private readonly host;
    private readonly port;
    private socket;
    constructor(host: string, port: number);
    connect(): Promise<any>;
    write(message: string): void;
    listen(callback: (data: Chunk) => void): void;
    once(callback: (data: Chunk) => void): void;
}
