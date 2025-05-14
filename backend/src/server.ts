import app from './app'

const start = async () => {
  try {
    await app.listen({ port: 4000 });
    app.log.info(`🚀 Server running on http://localhost:4000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start()
