import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated';
import { z } from 'zod';

const prisma = new PrismaClient();

const stockSummaryRoutes = (app: FastifyInstance) => {
  // Get all stock summaries
  app.get('/', async (_, reply) => {
    const summaries = await prisma.stockSummary.findMany({
      include: { product: true },
    });
    return reply.send(summaries);
  });

  // Get stock summary by product ID
  app.get('/:productId', async (request, reply) => {
    const { productId } = z.object({ productId: z.uuid() }).parse(request.params);

    const summary = await prisma.stockSummary.findUnique({
      where: { productId },
      include: { product: true },
    });

    if (!summary) return reply.code(404).send({ error: 'Stock summary not found' });
    return reply.send(summary);
  });

  // Get stock summaries by product name
  app.get('/by-name/:name', async (request, reply) => {
    const { name } = z.object({ name: z.string() }).parse(request.params);

    const summaries = await prisma.stockSummary.findMany({
      where: {
        product: { name: { contains: name } },
      },
      include: { product: true },
    });

    return reply.send(summaries);
  });
};

export { stockSummaryRoutes };
