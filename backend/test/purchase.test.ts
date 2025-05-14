import request from 'supertest';
import app from '../src/app';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import Fastify from 'fastify';


let server: ReturnType<typeof Fastify>;

beforeAll(async () => {
  server = await app.listen({ port: 0 }); // bind to random free port
});

afterAll(async () => {
  await app.close();
});

describe('GET /products', () => {
  it('should return 200', async () => {
    const response = await request(server).get('/products');
    expect(response.statusCode).toBe(200);
  });
});
