import Fastify, { FastifyError } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyAuth from '@fastify/auth';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import { productPriceRoutes, productRoutes, purchaseRoutes, salesRoutes, stockSummaryRoutes, supplierRoutes } from './routes';
import { jwtStrategy } from './services';
import { authRoutes } from './routes/auth';

const app = Fastify({ logger: true });

// Register plugins
app.register(fastifyCors, {
  origin: "https://soleilstock-production.up.railway.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
app.register(fastifyHelmet);

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(async (app) => {
  // This preHandler runs for all routes in this block
  app.addHook('preHandler', fastifyPassport.authenticate('jwt', { session: false }));

  app.register(productRoutes, { prefix: '/api/products' });
  app.register(supplierRoutes, { prefix: '/api/suppliers' });
  app.register(purchaseRoutes, { prefix: '/api/purchases' });
  app.register(salesRoutes, { prefix: '/api/sales' });
  app.register(stockSummaryRoutes, { prefix: '/api/stocks' });
  app.register(productPriceRoutes, { prefix: '/api/productPrices' });
});
app.register(fastifyAuth);
app.register(fastifySecureSession, {
  key: Buffer.from(process.env.SESSION_SECRET!, 'hex'),
  cookie: {
    path: '/',
    httpOnly: true,
    secure: 'auto',
  },
});
app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());


fastifyPassport.use('jwt', jwtStrategy);

// Central error handler
app.setErrorHandler((error: FastifyError, request, reply) => {
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
