export type HermesConnectionType = {
    host: string;
    port: number;
};

export type MessageType<T> = {
    type: string;
    data: T;
}