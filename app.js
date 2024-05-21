import Fastify from 'fastify';

export default function (opts = {}) {
  const app = Fastify(opts);

  const books = [
    { id: 1, title: "The Hitchhiker's Guide to the Galaxy", price: 15 },
    { id: 2, title: 'Pride and Prejudice', price: 10 },
    { id: 3, title: 'The Lord of the Rings', price: 25 },
  ];

  let orders = [];

  const findBookById = (id) => books.find((book) => book.id === id);

  app.get('/books', async (request, reply) => {
    reply.send(books);
  });

  app.post('/orders', async (request, reply) => {
    const { bookId, quantity } = request.body;

    const book = findBookById(bookId);
    if (!book) {
      reply.code(400).send({ error: `Book with ID ${bookId} not found` });
      return;
    }

    const total = book.price * quantity;
    const newOrder = { bookId, quantity, total };

    orders.push(newOrder);
    reply.send(newOrder);
  });

  app.get('/orders', async (request, reply) => {
    reply.send(orders);
  });

  return app;
}
