import { Socket } from 'net';

const socket = new Socket();
const port = 3000;

socket.connect(port, () => {
  console.log('Client 2 connected to broker');

  // Subscribe to topic "news"
  socket.write('news');
});

socket.on('data', (data: Buffer) => {
  const message = data.toString();
  console.log(`Client 2 received message: ${message}`);
});

