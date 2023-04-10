import { Hermes } from "./src/server";
import { ApplicationConfig } from './src/config';

const hermes = new Hermes(ApplicationConfig)

const hermesServer = hermes.server.listen({ host: ApplicationConfig.host, port: ApplicationConfig.port }, () => {
  const { host, port } = hermesServer.address() as any;
  console.log(`Hermes message broker started on ${host}:${port}`);
});