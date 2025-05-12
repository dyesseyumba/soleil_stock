import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '../generated';

const prisma = new PrismaClient();

const purchaseSchema = z.object({
  productId: z.string().uuid(),
  supplierId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitCost: z.number().positive(),
  expirationDate: z.date().optional(),
});

// type CreatePurchaseDTO = z.infer<typeof CreatePurchaseSchema>;

const purchaseRoutes = (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body = purchaseSchema.parse(request.body);

    const { productId, quantity, expirationDate } = body;

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: body,
      });

      const stock = await tx.stockSummary.upsert({
        where: { productId },
        update: {
          availableQuantity: {
            increment: quantity,
          },
        },
        create: {
          productId,
          availableQuantity: quantity,
          nextToExpire: expirationDate,
        },
        select: { id: true, nextToExpire: true },
      });

      if (
        expirationDate != undefined &&
        stock.nextToExpire != undefined &&
        new Date(expirationDate) < new Date(stock.nextToExpire)
      ) {
        await tx.stockSummary.update({ where: { id: stock.id }, data: { nextToExpire: expirationDate } });
      }

      return purchase;
    });

    reply.code(201).send(result);
  });

  // Get all purchases
  app.get('/', async (_, reply) => {
    const purchases = await prisma.purchase.findMany({
      include: {
        product: true,
        supplier: true,
      },
    });
    return reply.send(purchases);
  });

  // Get purchase by ID
  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        product: true,
        supplier: true,
      },
    });
    if (!purchase) return reply.code(404).send({ error: 'Not found' });
    return reply.send(purchase);
  });

  // Get purchases by product name
  app.get('/by-name/:name', async (request, reply) => {
    const paramsSchema = z.object({ name: z.string() });
    const { name } = paramsSchema.parse(request.params);

    const purchases = await prisma.purchase.findMany({
      where: {
        product: { name: name },
      },
      include: {
        product: true,
        supplier: true,
      },
    });
    return reply.send(purchases);
  });

  // Update a purchase
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = purchaseSchema.parse(request.body);
    const { productId, expirationDate, quantity } = data;

    const purchase = await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({ where: { id } });
      if (!existing) return reply.code(404).send({ error: 'Not found' });

      const updated = await tx.purchase.update({ where: { id }, data });

      const stock = await tx.stockSummary.upsert({
        where: { productId },
        create: {
          productId,
          availableQuantity: data.quantity,
          nextToExpire: expirationDate,
        },
        update: {
          availableQuantity: {
            increment: quantity - existing.quantity,
          },
        },
        select: { id: true, nextToExpire: true },
      });

      if (
        expirationDate != undefined &&
        stock.nextToExpire != undefined &&
        new Date(expirationDate) < new Date(stock.nextToExpire)
      ) {
        await tx.stockSummary.update({ where: { id: stock.id }, data: { nextToExpire: expirationDate } });
      }

      return reply.send(updated);
    });

    return reply.send(purchase);
  });

  // Delete a purchase
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({ where: { id } });
      if (!existing) throw new Error('Purchase not found');

      await tx.stockSummary.update({
        where: { productId: existing.productId },
        data: {
          availableQuantity: {
            decrement: existing.quantity,
          },
        },
      });

      return await tx.purchase.delete({ where: { id } });
    });

    reply.code(204).send();
  });
};

export { purchaseRoutes, purchaseSchema as CreatePurchaseSchema };
