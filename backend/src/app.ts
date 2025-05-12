import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { productRoutes } from './routes';

const app = Fastify();

// Register plugins
app.register(fastifyCors);
// app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
// app.register(fastifyBcrypt);
app.register(fastifyHelmet);
// app.register(authRoutes);

// Register routes
app.register(productRoutes, { prefix: '/products' })


const startServer = async () => {
  try {
    await app.listen({ port: 4000 });
    console.log(`🚀 Server running on http://localhost:4000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
