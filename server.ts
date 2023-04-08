import { Server, Socket } from 'net';

type Topic = string;
type Message = string;

interface Subscriber {
  socket: Socket;
  topics: Set<Topic>;
}

class Hermes {
  private server: Server;
  private subscribers: Subscriber[] = [];

  constructor() {
    this.server = new Server();
    this.server.on('connection', this.handleConnection.bind(this));
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

  private subscribe(subscriber: Subscriber, topic: Topic) {
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

  private publish(topic: Topic, message: Message) {
    for (const subscriber of this.subscribers) {
      if (subscriber.topics.has(topic)) {
        subscriber.socket.write(`${topic}:${message}`);
      }
    }
  }

  public start(host: string, port: number) {
    this.server.listen({ host, port, exclusive: true }, () => {
      console.log(`Broker started on port ${host}:${port}`);
    });
  }
}

const broker = new Hermes();
broker.start('localhost',3000);
