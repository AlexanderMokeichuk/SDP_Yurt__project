import express, { Response, NextFunction } from 'express';
import auth from '../middleware/Auth';
import { Error } from 'mongoose';
import { IRequestWithUser } from '../types/user';
import Order from '../models/Order';

const reportRouter = express.Router();

reportRouter.post('/', auth, generateReport);

async function generateReport(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    let { dateFrom, dateTo } = req.body;

    if (!dateFrom) {
      const currentDate = (dateFrom = new Date());
      currentDate.setUTCHours(0, 0, 0, 0);
      dateFrom = currentDate;
    }

    if (!dateTo) {
      const currentDate = (dateTo = new Date());
      currentDate.setUTCHours(23, 59, 59, 999);
      dateTo = currentDate;
    }

    const targetOrders = await Order.find({ orderDate: { $gte: dateFrom, $lte: dateTo } })
      .populate('yurt', '-_id title')
      .populate('createdBy', '-_id username')
      .populate('client', '-_id -blocked')
      .populate({
        path: 'services',
      })
      .populate({
        path: 'commentaries',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    return res.send(targetOrders.reverse());
  } catch (e) {
    if (e instanceof Error.CastError) {
      return res.status(404).send({ error: '"dateFrom" или "dateTo" должны быть датами.' });
    }
    next(e);
  }
}

export default reportRouter;
