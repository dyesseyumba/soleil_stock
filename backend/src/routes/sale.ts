import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '../generated';

const prisma = new PrismaClient();

const saleSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const saleRoutes = (app: FastifyInstance) => {
  // Create sale
  app.post('/', async (request, reply) => {
    const body = saleSchema.parse(request.body);
    const { productId, quantity } = body;

    const sale = await prisma.$transaction(async (tx) => {
      const stock = await tx.stockSummary.findUnique({
        where: { productId },
      });

      if (!stock || stock.availableQuantity < quantity) {
        throw new Error('Insufficient stock to complete sale');
      }

      const createdSale = await tx.sale.create({
        data: {
          productId,
          quantity,
          soldAt: new Date(),
        },
      });

      await tx.stockSummary.update({
        where: { productId },
        data: {
          availableQuantity: {
            decrement: quantity,
          },
        }
      });

      return createdSale;
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
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!sale) return reply.code(404).send({ error: 'Sale not found' });
    return reply.send(sale);
  });

  // Get sales by product name
  app.get('/by-name/:name', async (request, reply) => {
    const { name } = z.object({ name: z.string() }).parse(request.params);
    const sales = await prisma.sale.findMany({
      where: {
        product: { name },
      },
      include: { product: true },
    });
    return reply.send(sales);
  });

  // Delete sale
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({ where: { id } });
      if (!sale) return reply.code(404).send({ error: 'Sale not found' });

      await tx.sale.delete({ where: { id } });

      await tx.stockSummary.update({
        where: { productId: sale.productId },
        data: {
          availableQuantity: {
            increment: sale.quantity,
          }
        }
      });
    });

    reply.code(204).send();
  });
};

export { saleRoutes as salesRoutes, saleSchema as CreateSaleSchema };

