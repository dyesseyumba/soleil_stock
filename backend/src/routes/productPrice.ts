import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/prisma';

const productPriceSchema = z.object({
  productId: z.uuid('The format must be a CRUD'),
  price: z.number('The price must be a number').positive('The price must be positive'),
  effectiveAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

const productPriceUpdateSchema = productPriceSchema.partial();

const productPriceRoutes = (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body = productPriceSchema.parse(request.body);

    const productPrice = await prisma.productPrice.create({ data: body });
    return reply.code(201).send(productPrice);
  });

  app.get('/', async (_, reply) => {
    const productPrices = await prisma.productPrice.findMany();
    return reply.send(productPrices);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const productPrice = await prisma.productPrice.findUnique({ where: { id } });
    if (!productPrice) return reply.code(404).send({ error: 'Not found' });
    return reply.send(productPrice);
  });

  // Get Prices by ID
  app.get('/prices-by-product-id/:productId', async (request, reply) => {
    const paramsSchema = z.object({ productId: z.uuid() });
    const { productId } = paramsSchema.parse(request.params);

    const productPrices = await prisma.productPrice.findMany({
      where: { productId },
      orderBy: { effectiveAt: 'asc' }, // optional: helps with clarity
    });

    const today = new Date();

    // Find the active price (latest effectiveAt <= today)
    const activePrice = productPrices
      .filter((p) => p.effectiveAt <= today)
      .sort((a, b) => b.effectiveAt.getTime() - a.effectiveAt.getTime())[0];

    const result = productPrices.map((price) => ({
      ...price,
      status: price.id === activePrice?.id ? 'Actif' : 'Inactif',
    }));

    return reply.send(result);
  });

  app.get('/active-price/:productId', async (request, reply) => {
    const paramsSchema = z.object({ productId: z.uuid() });
    const { productId } = paramsSchema.parse(request.params);

    // Get the latest price whose effectiveAt <= today
    const activePrice = await prisma.productPrice.findFirst({
      where: {
        productId,
        effectiveAt: { lte: new Date() },
      },
      orderBy: { effectiveAt: 'desc' },
    });

    if (!activePrice) return reply.code(404).send({ message: 'No active price found' });

    return reply.send(activePrice);
  });

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = productPriceUpdateSchema.parse(request.body);

    const existing = await prisma.productPrice.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    const updated = await prisma.productPrice.update({ where: { id }, data });
    return reply.send(updated);
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.productPrice.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    await prisma.productPrice.delete({ where: { id } });
    return reply.code(204).send();
  });
};

export { productPriceRoutes, productPriceSchema, productPriceUpdateSchema };
