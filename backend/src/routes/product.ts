import { FastifyInstance } from 'fastify';
import { Prisma, PrismaClient, ProductPrice } from '../generated';
import { z } from 'zod';
// import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  // sellingPrice: z.number().positive('Price must be greater than zero'),
});

const querySchema = z.object({
  product: z.string().optional(),
  fromDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  toDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

const productUpdateSchema = productSchema.partial();

function getActivePriceFromArray(prices: ProductPrice[]): ProductPrice | undefined {
  return prices
    .filter((p) => p.effectiveAt <= new Date())
    .sort((a, b) => b.effectiveAt.getTime() - a.effectiveAt.getTime())[0];
}

function getPriceAtSaleDate(prices: ProductPrice[], saleDate: Date): ProductPrice | undefined {
  return prices
    .filter((p) => p.effectiveAt <= saleDate)
    .sort((a, b) => b.effectiveAt.getTime() - a.effectiveAt.getTime())[0];
}

const productRoutes = (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body = productSchema.parse(request.body);

    const product = await prisma.product.create({ data: body });
    return reply.code(201).send(product);
  });

  app.get('/', async (_, reply) => {
    const products = await prisma.product.findMany({
      include: {
        prices: { orderBy: { effectiveAt: 'desc' }, take: 1 },
        StockSummary: true,
      },
    });

    const result = products.map((p) => {
      // const latestPrice = p.prices[0]?.price ?? 0;
      const activePrice = p?.prices ? getActivePriceFromArray(p.prices)?.price : 0;
      const stock = p.StockSummary?.[0];

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: activePrice,
        availableQuantity: stock?.availableQuantity ?? 0,
        nextToExpire: stock?.nextToExpire ?? null,
        totalValue: Number(activePrice) * (stock?.availableQuantity ?? 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });
    return reply.send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        prices: { orderBy: { effectiveAt: 'desc' } },
        StockSummary: true,
      },
    });

    const activePrice = p?.prices ? getActivePriceFromArray(p.prices)?.price : 0;
    const stock = p?.StockSummary?.[0];

    const result = {
      id: p?.id,
      name: p?.name,
      description: p?.description,
      price: activePrice,
      availableQuantity: stock?.availableQuantity ?? 0,
      nextToExpire: stock?.nextToExpire ?? null,
      totalValue: Number(activePrice) * (stock?.availableQuantity ?? 0),
      createdAt: p?.createdAt,
      updatedAt: p?.updatedAt,
    };

    if (!p) return reply.code(404).send({ error: 'Not found' });
    return reply.send(result);
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

  app.get('/report', async (request, reply) => {
    const parsed = querySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send(z.treeifyError(parsed.error));
    }

    const { product, fromDate, toDate } = parsed.data;

    // Build date filter for sales
    const saleFilter: Prisma.SaleWhereInput = {};
    if (fromDate || toDate) {
      saleFilter.soldAt = {};
      if (fromDate) saleFilter.soldAt.gte = new Date(fromDate);
      if (toDate) saleFilter.soldAt.lte = new Date(toDate); // include the whole day
    }

    const products = await prisma.product.findMany({
      where: product ? { name: product } : undefined,
      include: {
        sales: { where: saleFilter },
        purchases: true,
        prices: { orderBy: { effectiveAt: 'desc' } },
      },
    });

    const result = products.map((p) => {
      let totalSold = 0;
      let totalRevenue = 0;
      let totalCost = 0;

      for (const sale of p.sales) {
        totalSold += sale.quantity;

        // Get the correct sale price
        const priceObj = getPriceAtSaleDate(p.prices, sale.soldAt);
        const salePrice = priceObj ? Number(priceObj.price) : 0;
        totalRevenue += sale.quantity * salePrice;

        // Compute average purchase price up to sale date
        const relevantPurchases = p.purchases
          .filter((pu) => pu.purchasedAt <= sale.soldAt)
          .sort((a, b) => a.purchasedAt.getTime() - b.purchasedAt.getTime());

        let remainingQty = sale.quantity;
        let saleCost = 0;

        for (const purchase of relevantPurchases) {
          if (remainingQty <= 0) break;

          const qtyUsed = Math.min(remainingQty, purchase.quantity);
          saleCost += qtyUsed * Number(purchase.unitCost);
          remainingQty -= qtyUsed;
        }

        totalCost += saleCost;
      }

      const profit = totalRevenue - totalCost;

      return {
        id: p.id,
        product: p.name,
        sold: totalSold,
        revenue: totalRevenue,
        cost: totalCost,
        profit,
      };
    });

    return reply.send(result);
  });
};

export { productRoutes, productSchema, productUpdateSchema, getActivePriceFromArray, getPriceAtSaleDate };
