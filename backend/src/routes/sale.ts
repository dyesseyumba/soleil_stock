import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '../generated';
import { getActivePriceFromArray } from './product';

const prisma = new PrismaClient();

const saleSchema = z.object({
  productId: z.uuid(),
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
        },
      });

      return createdSale;
    });

    reply.code(201).send(sale);
  });

  // Get all sales
  app.get('/', async (_, reply) => {
    const sales = await prisma.sale.findMany({
      include: { product: { include: { prices: { orderBy: { effectiveAt: 'desc' } } } } },
    });

    const result = sales.map((s) => {
      const activePrice = s.product?.prices ? getActivePriceFromArray(s.product.prices)?.price : 0;

      return {
        id: s.id,
        productId: s.productId,
        productName: s.product?.name,
        quantity: s.quantity,
        soldAt: s.soldAt,
        updatedAt: s.updatedAt,
        activePrice,
      };
    });

    return reply.send(result);
  });

  // Get sale by ID
  app.get('/:id', async (request, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(request.params);
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { product: { include: { prices: { orderBy: { effectiveAt: 'desc' } } } } },
    });

    if (!sale) return reply.code(404).send({ error: 'Sale not found' });

    const activePrice = sale.product?.prices ? getActivePriceFromArray(sale.product.prices)?.price : 0;

    const result = {
      id: sale.id,
      productId: sale.productId,
      productName: sale.product?.name,
      quantity: sale.quantity,
      soldAt: sale.soldAt,
      updatedAt: sale.updatedAt,
      activePrice,
    };

    return reply.send(result);
  });

  // Get sales by product name
  app.get('/by-name/:name', async (request, reply) => {
    const { name } = z.object({ name: z.string() }).parse(request.params);
    const sales = await prisma.sale.findMany({
      where: {
        product: { name },
      },
      include: { product: { include: { prices: { orderBy: { effectiveAt: 'desc' } } } } },
    });

    const result = sales.map((s) => {
      const activePrice = s.product?.prices ? getActivePriceFromArray(s.product.prices)?.price : 0;

      return {
        id: s.id,
        productId: s.productId,
        productName: s.product?.name,
        quantity: s.quantity,
        soldAt: s.soldAt,
        updatedAt: s.updatedAt,
        activePrice,
      };
    });

    return reply.send(result);
  });

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = saleSchema.parse(request.body);

    const existing = await prisma.sale.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    const updated = await prisma.sale.update({ where: { id }, data });
    return reply.send(updated);
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
          },
        },
      });
    });

    reply.code(204).send();
  });

  app.get('/monthly-sales', async (_, reply) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fetch all sales without prices for now (simple version)
    const sales = await prisma.sale.findMany();

    // Init monthly totals
    const monthlyTotals: Record<string, number> = {};
    months.forEach((m) => (monthlyTotals[m] = 0));

    // Sum quantities per month
    for (const s of sales) {
      const monthIndex = s.soldAt.getMonth(); // 0–11
      const monthLabel = months[monthIndex];
      monthlyTotals[monthLabel] += s.quantity;
    }

    // Convert to array for frontend
    const result = months.map((m) => ({
      month: m,
      sales: monthlyTotals[m],
    }));

    return reply.send(result);
  });

  app.get('/purchases-vs-sales', async (_, reply) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize structure
    const monthlyData: Record<string, { purchases: number; sales: number }> = {};
    months.forEach((m) => {
      monthlyData[m] = { purchases: 0, sales: 0 };
    });

    // Fetch all purchases and sales
    const purchases = await prisma.purchase.findMany();
    const sales = await prisma.sale.findMany();

    // Aggregate purchases
    for (const p of purchases) {
      const monthIndex = p.purchasedAt.getMonth(); // 0–11
      const monthLabel = months[monthIndex];
      monthlyData[monthLabel].purchases += p.quantity;
    }

    // Aggregate sales
    for (const s of sales) {
      const monthIndex = s.soldAt.getMonth();
      const monthLabel = months[monthIndex];
      monthlyData[monthLabel].sales += s.quantity;
    }

    // Convert into your required output array
    const result = months.map((m) => ({
      month: m,
      purchases: monthlyData[m].purchases,
      sales: monthlyData[m].sales,
    }));

    return reply.send(result);
  });

  app.get('/top-products-sold', async (_, reply) => {
  // Group sales by productId
  const grouped = await prisma.sale.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5, // top 5 products
  });

  // Attach product names
  const results = await Promise.all(
    grouped.map(async (g) => {
      const product = await prisma.product.findUnique({
        where: { id: g.productId },
        select: { name: true },
      });

      return {
        name: product?.name ?? 'Unknown',
        sold: g._sum.quantity,
      };
    })
  );

  return reply.send(results);
});

};

export { saleRoutes as salesRoutes, saleSchema as CreateSaleSchema };
