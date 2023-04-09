import { ApplicationConfig } from './config';
import { Hermes } from './server';
import { ConnectionOptions } from './types';
import * as dotenv from 'dotenv'

dotenv.config()

export class HermesPublisher {
    private broker: Hermes;

    constructor(options: ConnectionOptions){
        console.log(options);
        this.broker = new Hermes(options);

        this.broker.server.on('listening', () => {})
    }

    public deliver<T>(topic: string, message: T){
        setInterval(() => {
            this.broker.sendMessage<T>(topic, message);
        }, 2000);       
    }
}

const publisher = new HermesPublisher(ApplicationConfig);
publisher.deliver<string>('pipes', 'Hello World!');
