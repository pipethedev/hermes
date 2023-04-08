import { Socket } from 'net';

const socket = new Socket();
const port = 3000;

socket.connect(port, () => {
  console.log('Client 1 connected to broker');
});

socket.on('data', (data: Buffer) => {
  const message = data.toString();
  console.log(`Client 1 received message: ${message}`);
});

// Publish a message to topic "news"
setInterval(() => {
  socket.write('news:Hello, World!');
}, 3000)
