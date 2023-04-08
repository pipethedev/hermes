import { Socket } from 'net';

export type ConnectionOptions = {
    host: string;
    port: number;
    hermesKey: string;
    hermesToken: string;
}

export type Subscriber = {
    socket: Socket;
    topics: Set<string>;
}