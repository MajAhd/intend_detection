import express from 'express';
import { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import os from 'node:os';
import dns from 'node:dns';

import dotenv from 'dotenv';
import { ListenOptions } from 'node:net';
import HomeRoutes from './routes/homeRoute';
import ApiRoutes from './routes/apiRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', [HomeRoutes]);
app.use('/api', [ApiRoutes]);

// Following is json error handler
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    status: status,
    message: err.message || 'Internal Server Error',
  });
});

const server = http.createServer(app);
const OPTIONS: ListenOptions = {
  port: parseInt(process.env.PORT || '8000'),
};

server.listen(OPTIONS, () => {
  console.info(`> Local Api Server :  http://localhost:${OPTIONS.port}`);
  dns.lookup(os.hostname(), { family: 4 }, (err, addr) => {
    if (!err) {
      console.info(`> Network Api Server :  http://${addr}:${OPTIONS.port}`);
    }
  });
});

export default server;
