import { Socket } from 'net';

export type ConnectionOptions = {
    host: string;
    port: number;
}

export type Subscriber = {
    socket: Socket;
    topics: Set<string>;
}