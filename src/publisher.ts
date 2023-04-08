import Hermes from './server';
import { ConnectionOptions } from './types';


export class HermesPublisher {
    private broker: Hermes;

    constructor(options: ConnectionOptions){
        this.broker = new Hermes(options);

        this.broker.start();

        this.broker.server.on('listening', () => {})
    }

    public deliver<T>(topic: string, message: T){
        setInterval(() => {
            this.broker.sendMessage<T>(topic, message);
        }, 2000);       
    }
}

const publisher = new HermesPublisher({ host: 'localhost', port: 3000 });
publisher.deliver('pipes', 'Hello World!');
