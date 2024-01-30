import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { apiRouter } from '../../src/routers/apiRouter';

const app: express.Application = express();

app.use(
  cors({
    origin: ['https://spotymood.netlify.app'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);

app.use('/api', apiRouter());

export const handler = serverless(app);
