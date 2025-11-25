import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated';
import { z } from 'zod';
import { getActivePriceFromArray } from './product';

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

  app.get('/total-stock', async () => {
    const result = await prisma.stockSummary.aggregate({
      _sum: { availableQuantity: true },
    });

    return {
      totalStock: result._sum.availableQuantity || 0,
    };
  });

  app.get('/total-stock-value', async () => {
    const products = await prisma.product.findMany({
      include: {
        prices: true,
        StockSummary: true,
      },
    });

    let totalValue = 0;

    for (const p of products) {
      const activePriceDecimal = getActivePriceFromArray(p.prices)?.price ?? 0;
      const activePrice = Number(activePriceDecimal);

      const availableQty = p.StockSummary?.[0]?.availableQuantity ?? 0;

      totalValue += activePrice * availableQty;
    }

    return { totalStockValue: totalValue };
  });

  app.get('/out-of-stock', async (_, reply) => {
    const products = await prisma.product.findMany({
      include: {
        StockSummary: true,
      },
    });

    const count = products.filter((p) => {
      const available = p.StockSummary?.[0]?.availableQuantity ?? 0;
      return available === 0;
    }).length;

    return reply.send({ totalOutOfStock: count });
  });

  app.get('/expiring-soon', async (_, reply) => {
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + 30);

  const expiringProducts = await prisma.stockSummary.findMany({
    where: {
      nextToExpire: {
        not: null,
        gte: now,
        lte: limit,
      },
    },
    select: { productId: true },
  });

  return reply.send({ totalExpiring: expiringProducts.length });
});
};

export { stockSummaryRoutes };
