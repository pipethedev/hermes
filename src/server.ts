import { Server, Socket, createServer } from 'net';
import { connectionValidation } from './validations';
import { ConnectionOptions, Subscriber } from './types';

import { ApplicationConfig, validateKey } from './config';

export class Hermes {
  private host: any;
  private port: number;
  private hermesToken: string;
  private hermesKey: string;
  public server: any;
  private subscribers: Subscriber[] = [];
  static instance: any;

  constructor({ host, port, hermesToken, hermesKey }: ConnectionOptions) {
    // validate connection object

    connectionValidation.validate({ host, port });

    this.hermesToken = hermesToken;
    this.hermesKey = hermesKey;

    this.host = host;
    this.port = port;
    if(!validateKey(this.hermesKey, this.hermesToken)){
      console.error('Invalid hermes key');
    }else {
      this.server = createServer(this.handleConnection.bind(this)) as Server;
    }
  }

  public static getInstance({ host, port, hermesToken, hermesKey }: ConnectionOptions): Hermes {
    if (!Hermes.instance) {
      Hermes.instance = new Hermes({ host, port, hermesToken, hermesKey });
    }
    return Hermes.instance;
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

  public sendMessage<T>(topic: string, message: T) {
    console.log(`Sending message to broker: ${topic}:${message}`);
    const socket = new Socket();
    socket.connect(this.port, this.host, () => {
      socket.write(`${topic}:${message}`);
      socket.end();
    });
  }
}

export default new Hermes(ApplicationConfig);