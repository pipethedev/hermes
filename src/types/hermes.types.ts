import { Socket } from 'net';

export type HermesConnectionType = {
    host: string;
    port: number;
};

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

export type MessageType<T> = {
    type: string;
    data: T;
}