import { Hermes } from "./src/server";
import { ApplicationConfig } from './src/config';

const hermes = new Hermes(ApplicationConfig)

const server = hermes.server.listen({ host: ApplicationConfig.host, port: ApplicationConfig.port }, () => {
  const { port } = server.address() as any;
  const dyno = process.env.HOSTNAME || 'web.1';
  const url = `http://${dyno}.herokuapp.com:${port}`;
  console.log(`Hermes broker started on ${url}`);
});
