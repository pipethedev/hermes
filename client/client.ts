import net from 'net';

const client = net.createConnection({ port: 63625 }, () => { 
    console.log('connected to server!'); 

    const message = JSON.stringify({
        type: 'broadcast',
        data: {
          eventName: 'test',
          eventData: {
            message: 'Hello world'
          }
        }
      });

    client.write(message); 
});