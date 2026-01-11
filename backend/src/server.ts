import app from './app';
import 'dotenv/config';

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT ?? 4000) });
    app.log.info(`🚀 Server running on localhost: ${Number(process.env.PORT ?? 4000)})}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
