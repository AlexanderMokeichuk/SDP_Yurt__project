import express, { NextFunction, Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import auth from '../middleware/Auth';
import Order from '../models/Order';
import Client from '../models/Client';
import { IRequestWithUser } from '../types/user';
import { ObjectId } from 'mongodb';
import { ICommentary } from '../types/comment';
import permit from '../middleware/Permit';
import Yurt from '../models/Yurt';
import Service from '../models/Service';
import { IDateOrder, IOrderMutation, IOrderMutationFromDb } from '../types/order';

const ordersRouter = express.Router();

ordersRouter.post('/', auth, createOrder);
ordersRouter.get('/', auth, fetchOrders);
ordersRouter.get('/orderDates/:id', auth, getOrderDatesById);
ordersRouter.patch('/:id', auth, updateOrder);
ordersRouter.delete('/:id', auth, permit(['admin', 'owner']), deleteOrder);
ordersRouter.patch('/toggleCancel/:id', auth, toggleCancelOrder);

async function createOrder(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    let client = await Client.findOne({ clientPhone: req.body.clientPhone });

    if (!client) {
      const clientData = {
        clientPhone: req.body.clientPhone,
        clientName: req.body.clientName,
      };
      const newClient = new Client(clientData);
      await newClient.save();
      client = newClient;
    }

    if (req.body.clientName.trim() !== '' && client.clientName !== req.body.clientName) {
      await client.updateOne({ clientName: req.body.clientName });
    }

    if (client.blocked) {
      return res.status(400).send({ error: 'Данный клиент заблокирован, администрацией Usonbak' });
    }

    let commentariesData: ICommentary[] = [];
    if (req.body.commentaries) {
      commentariesData = req.body.commentaries.map((comment: { text: string }) => ({
        user: req.user?._id,
        text: comment.text,
      }));
    }

    const { yurt, prepaid, orderDate, createdAt, services } = req.body;

    if (!Types.ObjectId.isValid(yurt) && yurt) {
      return res.status(404).send({ error: 'Неправильный тип id у юрт!' });
    }

    const yurtData = await Yurt.findById(yurt);
    if (!yurtData) {
      return res.status(404).send({ error: 'Юрта не найдена' });
    }

    const servicesData = await Service.find({ _id: { $in: services } });

    const orderData: IOrderMutation = {
      yurt: yurtData._id.toString(),
      yurtPrice: yurtData.pricePerDay,
      createdBy: req.user?._id,
      client: client._id,
      totalPrice:
        yurtData.pricePerDay +
        servicesData.reduce((acc, service) => {
          return acc + (service.price as number);
        }, 0),
      prepaid: prepaid || 0,
      updatedBy: null,
      orderDate,
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: null,
      services: servicesData.map((service) => {
        return {
          _id: service._id,
          serviceTitle: service.title,
          serviceBookingPrice: service.price,
        };
      }),
      servicesBookingPrice: servicesData.reduce((acc, service) => {
        return acc + (service.price as number);
      }, 0),
      commentaries: commentariesData || [],
    };

    const order = new Order(orderData);
    await order.save();

    const orderByID = await Order.findById(order.id)
      .populate('yurt')
      .populate({
        path: 'createdBy',
        select: 'username phoneNumber',
      })
      .populate('client')
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
    return next(e);
  }
}

async function fetchOrders(_req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find()
      .sort({ orderDate: +1 })
      .populate('yurt')
      .populate({
        path: 'createdBy',
        select: 'username phoneNumber',
      })
      .populate('client')
      .populate({
        path: 'commentaries',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    return res.send(orders.reverse());
  } catch (e) {
    return next(e);
  }
}

async function getOrderDatesById(req: Request, res: Response, next: NextFunction) {
  const query = req.query.Id as string;

  try {
    const { id } = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch (e) {
      return res.status(404).send({ error: 'Id заказа должен быть ObjectId.' });
    }

    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    switch (query) {
      case 'yurt':
        const datesYurt = (await Order.find({
          yurt: _id,
          canceled: false,
          orderDate: { $gte: date },
        })
          .populate('yurt')
          .select('orderDate')) as [];
        return res.send(datesYurt);
      case 'service':
        const array: IDateOrder[] = [];
        const datesServices = (await Order.find({
          canceled: false,
          orderDate: { $gte: date },
        })) as [];
        datesServices.filter((item: IOrderMutationFromDb) => {
          item.services.filter((itemService) => {
            if (itemService._id.toString() === _id.toString()) {
              array.push({
                _id: item._id,
                orderDate: item.orderDate,
                service: itemService,
              });
            }
          });
        });

        return res.send(array);

      case 'client':
        const datesClient = (await Order.find({
          client: _id,
          canceled: false,
          orderDate: { $gte: date },
        })
          .populate('client')
          .select('orderDate')) as [];
        return res.send(datesClient);
    }

    return res.status(404).send({ error: 'Not found!!' });
  } catch (e) {
    return next(e);
  }
}

async function updateOrder(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const _id = new Types.ObjectId(req.params.id);
    const userUpdater = req.user?._id;
    const { yurt, prepaid, orderDate, services, commentaries } = req.body;

    const date = new Date(orderDate);
    date.setUTCHours(0, 0, 0, 0);

    let client = await Client.findOne({ clientPhone: req.body.clientPhone });
    if (!client) {
      const newClient = new Client({
        clientName: req.body.clientName,
        clientPhone: req.body.clientPhone,
      });
      await newClient.save();
      client = newClient;
    }

    if (client.clientName !== req.body.clientName.trim()) {
      const clientData = {
        clientPhone: client.clientPhone,
        clientName: req.body.clientName.trim(),
      };
      client = await client.updateOne(clientData);
    }

    let updatedCommentaries: ICommentary[] = [];
    if (commentaries.length > 0) {
      updatedCommentaries = commentaries.map((comment: { text: string }) => ({
        user: userUpdater,
        text: comment.text,
      }));
    }

    if (!Types.ObjectId.isValid(yurt) && yurt) {
      return res.status(404).send({ error: 'Неправильный тип id у юрт!' });
    }

    const servicesData = await Service.find({ _id: { $in: services } });

    const yurtData = await Yurt.findById(yurt);
    if (!yurtData) {
      return res.status(404).send({ error: 'Юрта не найдена' });
    }

    const updatedOrder = await Order.updateOne(
      {
        _id,
      },
      {
        $set: {
          yurt,
          yurtPrice: yurtData.pricePerDay,
          totalPrice:
            yurtData.pricePerDay +
            servicesData.reduce((acc, service) => {
              return acc + (service.price as number);
            }, 0),
          updatedBy: userUpdater,
          client: client?._id,
          prepaid,
          orderDate: date,
          updatedAt: new Date().toISOString(),
          services: servicesData.map((service) => {
            return {
              _id: service._id,
              serviceTitle: service.title,
              serviceBookingPrice: service.price,
            };
          }),
          servicesBookingPrice: servicesData.reduce((acc, service) => {
            return acc + (service.price as number);
          }, 0),
        },
        $push: { commentaries: { $each: [...updatedCommentaries] } },
      },
    );

    if (updatedOrder.matchedCount === 0) {
      return res.status(404).send({ error: 'Заказ не найден!' });
    }

    const orderByID = await Order.findById(_id)
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

    return next(e);
  }
}

async function deleteOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const result = await Order.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Заказ не найден' });
    }
  } catch (e) {
    return next(e);
  }
}

async function toggleCancelOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch (e) {
      return res.status(404).send({ error: 'Id заказа должен быть ObjectId.' });
    }
    const candidateOrder = await Order.findById(_id);

    if (!candidateOrder) {
      return res.status(404).send({ error: 'Нет заказа с таким ID' });
    }

    if (candidateOrder.canceled) {
      const alreadyExistThatDayThatYurt = await Order.find({
        yurt: candidateOrder.yurt,
        orderDate: candidateOrder.orderDate,
        canceled: false,
      });

      if (alreadyExistThatDayThatYurt.length) {
        return res.status(404).send({
          error: {
            ru: 'Данная юрта уже забронирована на данное число! Для возобновления заказа измените дату!!',
            kg: 'Бул боз үй бул күнгө чейин брондолгон! Буйрутмаңызды жаңыртуу үчүн датаны өзгөртүңүз!!',
          },
        });
      }
    }

    candidateOrder.canceled = !candidateOrder.canceled;
    await candidateOrder.save();
    return res.send(candidateOrder.id);
  } catch (e) {
    next(e);
  }
}

export default ordersRouter;
