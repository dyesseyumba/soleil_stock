import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '../generated';

const prisma = new PrismaClient();

const saleSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const salesRoutes = (app: FastifyInstance) => {
  // Create a sale
  app.post('/', async (request, reply) => {
    const body = saleSchema.parse(request.body);
    const { productId, quantity, unitPrice } = body;

    const sale = await prisma.$transaction(async (tx) => {
      // Get lots (FIFO: oldest lot first)
      const availableLots = await tx.stockSummary.findMany({
        where: {
          productId,
          availableQuantity: { gt: 0 },
        },
        orderBy: {
          lastUpdated: 'asc',
        },
      });

      let remaining = quantity;
      for (const lot of availableLots) {
        const deduction = Math.min(remaining, lot.availableQuantity);

        await tx.stockSummary.update({
          where: {
            productId_lotNumber: {
              productId,
              lotNumber: lot.lotNumber,
            },
          },
          data: {
            availableQuantity: {
              decrement: deduction,
            },
            lastUpdated: new Date(),
          },
        });

        remaining -= deduction;
        if (remaining <= 0) break;
      }

      if (remaining > 0) {
        throw new Error('Insufficient stock to complete sale');
      }

      // Record the sale (no lot)
      return await tx.sale.create({
        data: {
          productId,
          quantity,
          soldAt: new Date(),
          unitPrice,
        },
      });
    });

    reply.code(201).send(sale);
  });

  // Get all sales
  app.get('/', async (_, reply) => {
    const sales = await prisma.sale.findMany({
      include: { product: true },
    });
    return reply.send(sales);
  });

  // Get sale by ID
  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!sale) return reply.code(404).send({ error: 'Sale not found' });
    return reply.send(sale);
  });

  // Get sales by product name
  app.get('/by-name/:name', async (request, reply) => {
    const paramsSchema = z.object({ name: z.string() });
    const { name } = paramsSchema.parse(request.params);

    const sales = await prisma.sale.findMany({
      where: {
        product: {
          name: name,
        },
      },
      include: { product: true },
    });

    return reply.send(sales);
  });

  // Delete sale (optional)
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const sale = await prisma.sale.findUnique({ where: { id } });
    if (!sale) return reply.code(404).send({ error: 'Sale not found' });

    await prisma.$transaction(async (tx) => {
      let remaining = sale.quantity;

      const lots = await tx.stockSummary.findMany({
        where: { productId: sale.productId },
        orderBy: { lastUpdated: 'desc' }, // LIFO for rollback
      });

      for (const lot of lots) {
        await tx.stockSummary.update({
          where: {
            productId_lotNumber: {
              productId: sale.productId,
              lotNumber: lot.lotNumber,
            },
          },
          data: {
            availableQuantity: {
              increment: remaining,
            },
            lastUpdated: new Date(),
          },
        });

        remaining = 0;
        break; // rollback total, no per-lot tracking here
      }

      await tx.sale.delete({ where: { id } });
    });

    reply.code(204).send();
  });
};

export { salesRoutes, saleSchema as CreateSaleSchema };
