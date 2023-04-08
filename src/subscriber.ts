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

const subscriber = new HermesSubscriber({ host: 'localhost', port: 3000, hermesKey: 'abcdefg123456', hermesToken: 'f3895c544c3966873f32b85969eba496:53616c7465645f5f0000000000000000f4cdf2167d1533ae18a7078464b2f6eaf2f6d69ba21aaf8939ce24639b8c61b6ebe9b5b9063420a711927a486cc0ca5f3bad937c57390eebab542022829ef2ba6d70c5f60c31027b245d31872cb9bbc498362e3ae8058f' });

subscriber.on('pipes', (message) => {
  console.log('Received news:', message);
});