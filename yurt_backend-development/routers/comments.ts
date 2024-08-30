import express, { Response, NextFunction } from 'express';
import auth from '../middleware/Auth';
import { Types, Error } from 'mongoose';
import { IRequestWithUser } from '../types/user';
import Order from '../models/Order';

const commentRouter = express.Router();

commentRouter.post('/', auth, addComment);

async function addComment(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const orderID = req.query.orderID as string;
    if (!Types.ObjectId.isValid(orderID)) {
      return res.status(400).send({ error: 'Неправильный id!' });
    }
    const commentData = {
      user: req.user?._id,
      text: req.body.text,
    };
    const order = await Order.findById(orderID);

    if (!order) {
      return res.status(404).send({ error: 'Заказ не найден.' });
    }

    order.commentaries.push(commentData);

    await order.save();
    const orderByID = await Order.findById(order.id)
      .populate('yurt')
      .populate({
        path: 'createdBy',
        select: 'username phoneNumber',
      })
      .populate('client')
      .populate('services')
      .populate({
        path: 'commentaries',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    return res.send(orderByID);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
}

export default commentRouter;
