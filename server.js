import app from './app.js';

const port = process.env.PORT || 3000;

const server = app({
  logger: true,
});

server.listen({ port }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(`Fastify is listening on port: ${address}`);
});
