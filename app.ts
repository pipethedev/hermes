import { Hermes } from "./src/server";
import { ApplicationConfig } from './src/config';

const hermes = new Hermes(ApplicationConfig)

const server = hermes.server.listen({ host: ApplicationConfig.host, port: ApplicationConfig.port }, () => {
  const { host, port } = server.address() as any;
  console.log(`Hermes broker started on ${host}:${port}`);
});
