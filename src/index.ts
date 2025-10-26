import app from './app';
import { PORT } from './config';
import { initDb, pool } from './db';

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => {
      await pool.end();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();