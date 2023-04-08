import { Server, Socket, createServer } from 'net';
import { connectionValidation } from './validations';
import { Subscriber } from './types';

export class Hermes {
  private host: string = 'localhost';
  private port: number;
  public server: Server;
  private subscribers: Subscriber[] = [];

  constructor({ host, port }: { host: string, port: number}) {
    // validate connection object

    connectionValidation.validate({ host, port });

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
    this.server.listen({ host: this.host, port: this.port }, () => {
      const { port, host } = this.server.address() as any;
      console.log(`Broker started on tcp://${this.host}:${port}`);
    });
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

export default Hermes;