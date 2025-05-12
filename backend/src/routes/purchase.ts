import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '../generated';

const prisma = new PrismaClient();

const purchaseSchema = z.object({
  productId: z.string().uuid(),
  supplierId: z.string().uuid(),
  lotNumber: z.string().min(2),
  quantity: z.number().int().positive(),
  unitCost: z.number().positive(),
  expirationDate: z.date().optional(),
});

// type CreatePurchaseDTO = z.infer<typeof CreatePurchaseSchema>;

const purchaseRoutes = (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body = purchaseSchema.parse(request.body);

    const { productId, lotNumber, quantity } = body;

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: body,
      });

      await tx.stockSummary.upsert({
        where: {
          productId_lotNumber: {
            productId,
            lotNumber,
          },
        },
        update: {
          availableQuantity: {
            increment: quantity,
          },
          // lastUpdated: new Date(),
        },
        create: {
          productId,
          lotNumber,
          availableQuantity: quantity,
          lastUpdated: new Date(),
        },
      });

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
  app.put('/purchases/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = purchaseSchema.parse(request.body);
    const { productId, lotNumber, quantity } = data;

    const purchase = await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({ where: { id } });
      if (!existing) return reply.code(404).send({ error: 'Not found' });

      const updated = await tx.purchase.update({ where: { id }, data });

      await tx.stockSummary.upsert({
        where: {
          productId_lotNumber: { productId, lotNumber },
        },
        create: {
          productId,
          lotNumber,
          availableQuantity: data.quantity,
        },
        update: {
          availableQuantity: {
            increment: quantity - existing.quantity,
          },
        },
      });

      return reply.send(updated);;
    });

    return reply.send(purchase);;
  });

  // Delete a purchase
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({ where: { id } });
      if (!existing) throw new Error('Purchase not found');

      await tx.stockSummary.update({
        where: {
          productId_lotNumber: {
            productId: existing.productId,
            lotNumber: existing.lotNumber,
          },
        },
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
