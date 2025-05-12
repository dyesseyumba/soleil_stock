import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated';
import { z } from 'zod';
// import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  // sellingPrice: z.number().positive('Price must be greater than zero'),
});

const productUpdateSchema = productSchema.partial();

// TypeScript types inferred from Zod
// export type ProductInput = z.infer<typeof productSchema>
// export type ProductUpdateInput = z.infer<typeof productUpdateSchema>

const productRoutes = (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body = productSchema.parse(request.body);

    const product = await prisma.product.create({ data: body });
    return reply.code(201).send(product);
  });

  app.get('/', async (_, reply) => {
    const products = await prisma.product.findMany();
    return reply.send(products);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return reply.code(404).send({ error: 'Not found' });
    return reply.send(product);
  });

  // Get product
  app.get('/by-name/:name', async (request, reply) => {
    const paramsSchema = z.object({ name: z.string() });
    const { name } = paramsSchema.parse(request.params);

    const products = await prisma.product.findMany({
      where: {
        name,
      },
    });
    return reply.send(products);
  });

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = productUpdateSchema.parse(request.body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    const updated = await prisma.product.update({ where: { id }, data });
    return reply.send(updated);
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    await prisma.product.delete({ where: { id } });
    return reply.code(204).send();
  });
};

export { productRoutes, productSchema, productUpdateSchema };
