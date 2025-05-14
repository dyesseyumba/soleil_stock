import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { productRoutes, purchaseRoutes, salesRoutes, stockSummaryRoutes, supplierRoutes } from './routes';

const app = Fastify({ logger: true });

// Register plugins
app.register(fastifyCors);
// app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
// app.register(fastifyBcrypt);
app.register(fastifyHelmet);
// app.register(authRoutes);

// Register routes
app.register(productRoutes, { prefix: '/products' });
app.register(supplierRoutes, { prefix: '/suppliers' });
app.register(purchaseRoutes, { prefix: '/purchases' });
app.register(salesRoutes, { prefix: '/sales' });
app.register(stockSummaryRoutes, { prefix: '/stocks' });

// Central error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (error.validation) {
    return reply.code(400).send({ message: 'Validation error', errors: error.validation });
  }

  if (error.code === 'P2002') {
    return reply.code(409).send({ message: 'Duplicate entry' });
  }

  return reply.code(500).send({ message: 'Internal server error' });
});

export default app;
