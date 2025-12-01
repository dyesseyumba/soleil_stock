import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated';
import { z } from 'zod';
import { getActivePriceFromArray } from './product';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function getRecentActivity(): Promise<string[]> {
  const [sales, purchases, priceUpdates, stockUpdates] = await Promise.all([
    prisma.sale.findMany({
      include: { product: true },
      orderBy: { soldAt: 'desc' },
      take: 1,
    }),

    prisma.purchase.findMany({
      include: { product: true },
      orderBy: { purchasedAt: 'desc' },
      take: 1,
    }),

    prisma.productPrice.findMany({
      include: { product: true },
      orderBy: { effectiveAt: 'desc' },
      take: 1,
    }),

    prisma.stockSummary.findMany({
      include: { product: true },
      orderBy: { lastUpdated: 'desc' },
      take: 1,
    }),
  ]);

  const activities: { msg: string; date: Date }[] = [];

  // Sales
  sales.forEach((s) => {
    activities.push({
      msg: `Vente: ${s.quantity} unités de ${s.product.name}`,
      date: s.soldAt,
    });
  });

  // Purchases
  purchases.forEach((p) => {
    activities.push({
      msg: `Approvisionnement: ${p.quantity} unités de ${p.product.name}`,
      date: p.purchasedAt,
    });
  });

  // Stock Summary updates
  stockUpdates.forEach((s) => {
    activities.push({
      msg: `Stock: ${s.product.name} ajusté à ${s.availableQuantity} unités`,
      date: s.lastUpdated,
    });
  });

  // Product price updates
  priceUpdates.forEach((p) => {
    activities.push({
      msg: `Prix: ${p.product.name} – nouveau prix appliqué`,
      date: p.effectiveAt,
    });
  });

  // Sort newest first
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Format into final strings
  const formatted = activities.slice(0, 15).map((a) => {
    const d = format(a.date, 'MMM dd'); // e.g., "Nov 19"
    return `${a.msg} (${d})`;
  });

  return formatted;
}

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

  app.get('/alerts', async (_, reply) => {
    const alerts: string[] = [];

    // 1️⃣ OUT OF STOCK
    const outOfStock = await prisma.stockSummary.findMany({
      where: { availableQuantity: 0 },
      include: { product: true },
    });

    outOfStock.forEach((s) => alerts.push(`Produit: ${s.product.name} – en rupture de stock`));

    // 2️⃣ LOW STOCK (threshold = 10 units)
    const lowStock = await prisma.stockSummary.findMany({
      where: { availableQuantity: { lt: 10, gt: 0 } },
      include: { product: true },
    });

    lowStock.forEach((s) =>
      alerts.push(
        `Produit: ${s.product.name} – En dessous du seuil minimum (${s.availableQuantity} restant)`,
      ),
    );

    // 3️⃣ EXPIRING SOON (next 30 days)
    const soonToExpire = await prisma.purchase.findMany({
      where: {
        expirationDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: { product: true },
    });

    soonToExpire.forEach((p) => {
      if (p.expirationDate) {
        const days = Math.ceil((p.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        alerts.push(`Produit: ${p.product.name} – Expire dans ${days} jours`);
      }
    });

    // 4️⃣ STOCK ANOMALY (simple detection: availableQuantity >= 100)
    const anomalies = await prisma.stockSummary.findMany({
      where: { availableQuantity: { gte: 100 } },
      include: { product: true },
    });

    anomalies.forEach((s) =>
      alerts.push(
        `Anomalie détectée dans la variation des stocks de ${s.product.name} (+${s.availableQuantity} unités)`,
      ),
    );

    return reply.send(alerts);
  });

  app.get('/recent-activity', async (_, reply) => {
    const data = await getRecentActivity();
    return  reply.send(data);
  });
};

export { stockSummaryRoutes, getRecentActivity };
