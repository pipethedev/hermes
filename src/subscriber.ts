import { Socket } from 'net';
import { ConnectionOptions } from './types';

export class HermesSubscriber {
  private socket: Socket;
  private options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    this.options = options;
    this.socket = new Socket();
    this.socket.connect(this.options.port, this.options.host, () => {
      console.log('Subscriber connected to broker.');
    });

    this.socket.on('error', (err) => {
      console.error('Error connecting to broker:', err);
    });
  }

  public on(topicName: string, callback: (message: string) => void) {
    this.subscribe(topicName);
    this.socket.on('data', (data: Buffer) => {
      const message = data.toString();
      const [topic, content] = message.split(':');
      if (topic === topicName) {
        callback(content);
      }
    });
  }

  private subscribe(topic: string) {
    console.log(`Subscribing to topic: ${topic}`);
    this.socket.write(`${topic}:`);
  }
}

const subscriber = new HermesSubscriber({
  host: 'localhost',
  port: 3000
});

subscriber.on('pipes', (message) => {
  console.log('Received news:', message);
});