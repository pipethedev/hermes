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

const publisher = new HermesPublisher({ host: 'localhost', port: 3000, hermesKey: 'abcdefg123456', hermesToken: 'a4990c45fe9a07c02ff4c65e8b245c76:53616c7465645f5f414243444546474890346978006d055fb1488ee25f706c2ab98224b41cca94b62228a7e0611b3e6677036c82137c6f2ac38b94b978b86d46d77cd3f2f6425b31bc7cc7c095b746e837ea4279813c21d80c79a2fd8e5372df3e6d7f81c28475' });
publisher.deliver<string>('pipes', 'Hello World!');
