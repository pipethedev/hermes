import * as dotenv from 'dotenv'
dotenv.config()

import Hermes from "./src/server";

const server = Hermes.server.listen({ host: process.env.HOST, port: Number(process.env.PORT) }, () => {
    const { port } = server.address() as any;
    console.log(`Hermes broker started on https://${process.env.HOST}:${port}`);
  });
