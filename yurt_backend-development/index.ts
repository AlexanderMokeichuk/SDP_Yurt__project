import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routers/users';
import cookieParser from 'cookie-parser';
import yurtsRouter from './routers/yurts';
import ordersRouter from './routers/orders';
import serviceRouter from './routers/services';
import clientRouter from './routers/clients';
import commentRouter from './routers/comments';
import reportRouter from './routers/reports';

const app = express();
const localhost = `http://localhost:${config.port}`;

app.use(
  cors({
    origin: config.IpWhiteList,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/users', usersRouter);
app.use('/yurts', yurtsRouter);
app.use('/orders', ordersRouter);
app.use('/services', serviceRouter);
app.use('/clients', clientRouter);
app.use('/comments', commentRouter);
app.use('/reports', reportRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(config.port, () => {
    console.log(`Server running at ${localhost}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();
