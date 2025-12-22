import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/prisma';

const supplierSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  contactInfo: z.string().min(6),
});

const supplierUpdateSchema = supplierSchema.partial();

const supplierRoutes = (app: FastifyInstance) => {

  app.post('/', async (request, reply) => {
    const body = supplierSchema.parse(request.body);

    const supplier = await prisma.supplier.create({ data: body });
    return reply.code(201).send(supplier);
  });

  app.get('/', async (_, reply) => {
    const suppliers = await prisma.supplier.findMany();
    return reply.send(suppliers);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) return reply.code(404).send({ error: 'Not found' });
    return reply.send(supplier);
  });

  // Get product
  app.get('/by-name/:name', async (request, reply) => {
    const paramsSchema = z.object({ name: z.string() });
    const { name } = paramsSchema.parse(request.params);

    const suppliers = await prisma.supplier.findMany({ where: { name } });
    return reply.send(suppliers);
  });

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = supplierUpdateSchema.parse(request.body);

    const existing = await prisma.supplier.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    const updated = await prisma.supplier.update({ where: { id }, data });
    return reply.send(updated);
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await prisma.supplier.findUnique({ where: { id } });
    if (!existing) return reply.code(404).send({ error: 'Not found' });

    await prisma.supplier.delete({ where: { id } });
    return reply.code(204).send();
  });
};

export { supplierRoutes, supplierSchema, supplierUpdateSchema };
