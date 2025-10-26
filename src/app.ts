import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import todoRoutes from './routes/todos';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

// Generic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err?.status || 500;
  res.status(status).json({ error: err?.message || 'Internal server error' });
});

export default app;