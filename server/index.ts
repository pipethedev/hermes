import net from 'net';
import { EventEmitter } from 'events';
import { MessageType } from 'types/hermes.types';

class Hermes {
    protected events: EventEmitter;
    protected connections: Map<string, any>;

    constructor () {
        this.events  = new EventEmitter();
        this.connections = new Map();
    }

    // estatblish connection
    public connect (connection: any) {
        const id = 'http://localhost' + ':' + connection.remotePort;

        this.connections.set(id, connection);

        console.log(`connected to ${id} ===> HERMES\n`);

        connection.write(`connected to ${id} ===> HERMES\n`);

        connection.on('data', (data: any) => {
            try {
                this.events.emit('data', data);
            } catch (err) {
                console.error(err);
            }
        });

        // Closing the connection up
        connection.on('close', () => {
            this.disconnect(id);
        });
    }

    // send data to all connections
    public send<T>(identifier: string, message: MessageType<T>) {
        const { type, data } = message;
        switch(type) {
            case 'emit':
                this.fly(identifier, data);
            break;
            case 'on':
                this.on(identifier, data as any);
            break;
            default:
            console.error(`Unknown message type: ${type}`);
        }
    }

    protected fly<T>(id: string, data: T) {
        const connection = this.connections.get(id);
        if (connection) {
            const message = { type: 'event', data };
            const payload = JSON.stringify(message);
            console.log('payload', payload);
            connection.write(payload);
        }
    }

    protected on(id: string, event: string) {
        const socket = this.connections.get(id);
        if (socket) {
          const listener = (data: any) => {
            const message = { type: 'event', data };
            const payload = JSON.stringify(message);
            console.log('payload', payload);
            socket.write(payload);
          };
          this.events.on(event, listener);
        }
    }
    

    protected disconnect (id: string) {
        this.connections.delete(id);
    }
}

const hermes = new Hermes();
const serverSocket = net.createServer(hermes.connect.bind(hermes));
serverSocket.listen(8888);