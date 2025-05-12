import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated';
import { z } from 'zod';

const prisma = new PrismaClient();

const supplierSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  contactInfo: z.string().min(6),
});

const supplierUpdateSchema = supplierSchema.partial();

// TypeScript types inferred from Zod
// export type ProductInput = z.infer<typeof supplierSchema>
// export type ProductUpdateInput = z.infer<typeof supplierUpdateSchema>

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

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = supplierUpdateSchema.parse(request.body);

    try {
      const updated = await prisma.supplier.update({ where: { id }, data });
      return reply.send(updated);
    } catch {
      return reply.code(404).send({ error: 'Not found' });
    }
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.supplier.delete({ where: { id } });
      return reply.code(204).send();
    } catch {
      return reply.code(404).send({ error: 'Not found' });
    }
  });
};

export { supplierRoutes, supplierSchema, supplierUpdateSchema };
