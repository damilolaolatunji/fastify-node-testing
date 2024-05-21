import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import buildApp from '../app.js';

describe('Application endpoints', () => {
  let app;

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /books', () => {
    it('should return a list of books', async () => {
      const response = await app.inject({
        url: '/books',
      });

      assert.deepStrictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().length, 3);
      assert.strictEqual(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      );
      assert.deepStrictEqual(response.json(), [
        { id: 1, title: "The Hitchhiker's Guide to the Galaxy", price: 15 },
        { id: 2, title: 'Pride and Prejudice', price: 10 },
        { id: 3, title: 'The Lord of the Rings', price: 25 },
      ]);
    });
  });

  describe('GET /orders', () => {
    it('should return an empty list of orders', async () => {
      const response = await app.inject({
        url: '/orders',
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().length, 0);
      assert.deepStrictEqual(response.json(), []);
    });

    it('should return a list of existing orders', async () => {
      // Create a new order
      await app.inject({
        url: '/orders',
        method: 'post',
        payload: {
          bookId: 1,
          quantity: 4,
        },
      });

      const response = await app.inject({
        url: '/orders',
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().length, 1);
      assert.deepStrictEqual(response.json(), [
        {
          bookId: 1,
          quantity: 4,
          total: 60,
        },
      ]);
    });
  });

  describe('POST /orders', () => {
    it('should create a new order successfully', async () => {
      const response = await app.inject({
        url: '/orders',
        method: 'post',
        payload: {
          bookId: 1,
          quantity: 4,
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        bookId: 1,
        quantity: 4,
        total: 60,
      });
    });

    it('should return a bad request for a non-existent book', async () => {
      const response = await app.inject({
        url: '/orders',
        method: 'post',
        payload: {
          bookId: 10,
          quantity: 4,
        },
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().error, 'Book with ID 10 not found');
    });
  });
});
