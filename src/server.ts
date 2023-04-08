import { Server, Socket, createServer } from 'net';
import { connectionValidation } from './validations';
import { ConnectionOptions, Subscriber } from './types';
import CryptoJS from 'crypto-js';

export class Hermes {
  private host: string = 'localhost';
  private port: number;
  private hermesToken: string;
  private hermesKey: string;
  public server: Server;
  private subscribers: Subscriber[] = [];

  constructor({ host, port, hermesToken, hermesKey }: ConnectionOptions) {
    // validate connection object

    connectionValidation.validate({ host, port });

    this.hermesToken = hermesToken;
    this.hermesKey = hermesKey;

    this.port = port;
    this.server = createServer(this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    console.log('New subscriber connected.');

    const subscriber: Subscriber = {
      socket,
      topics: new Set(),
    };

    this.subscribers.push(subscriber);

    socket.on('data', (data: Buffer) => {
      const message = data.toString();
      const [topic, content] = message.split(':');

      if (content) {
        this.publish(topic, content);
      } else {
        this.subscribe(subscriber, topic);
      }
    });

    socket.on('end', () => {
      console.log('Subscriber disconnected.');
      this.unsubscribe(subscriber);
    });
  }

  private subscribe(subscriber: Subscriber, topic: string) {
    console.log(`Subscriber subscribed to topic: ${topic}`);

    subscriber.topics.add(topic);
  }

  private unsubscribe(subscriber: Subscriber) {
    console.log('Removing subscriber.');

    const index = this.subscribers.indexOf(subscriber);

    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }

    for (const topic of subscriber.topics) {
      this.publish(topic, `Subscriber left the topic.`);
    }
  }

  private publish<T>(topic: string, message: T) {
    for (const subscriber of this.subscribers) {
      if (subscriber.topics.has(topic)) {
        subscriber.socket.write(`${topic}:${message}`);
      }
    }
  }

  public start() {
    if(!this.validateKey(this.hermesKey, this.hermesToken)){
      console.error('Invalid hermes key');
    } else {
      this.server.listen({ host: this.host, port: this.port }, () => {
        const { port, host } = this.server.address() as any;
        console.log(`Broker started on tcp://${this.host}:${port}`);
      });
    }
  }

  public sendMessage<T>(topic: string, message: T) {
    console.log(`Sending message to broker: ${topic}:${message}`);
    const socket = new Socket();
    socket.connect(this.port, this.host, () => {
      socket.write(`${topic}:${message}`);
      socket.end();
    });
  }

  private validateKey(key: string, encryptedData: any) {
    const split = encryptedData.split(':');
    if (split.length < 2) return '';

    const reb64 = CryptoJS.enc.Hex.parse(split[1]);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    
    const hash = CryptoJS.AES.decrypt(bytes, key, {
        iv: split[0],
        mode: CryptoJS.mode.CTR
    });
    const val = hash.toString(CryptoJS.enc.Utf8);
    const data = val.split('_');
    if(data[1] !== this.hermesKey) {
      return false;
    }
    return true;
  }
}

export default Hermes;