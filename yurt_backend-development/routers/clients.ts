import express, { NextFunction, Request, Response } from 'express';
import auth from '../middleware/Auth';
import Client from '../models/Client';
import { ObjectId } from 'mongodb';
import permit from '../middleware/Permit';

const clientRouter = express.Router();

clientRouter.get('/', auth, searchClient);
clientRouter.get('/getClients', auth, getAllClients);
clientRouter.patch('/toggleBlockClient/:id', auth, permit(['admin', 'owner']), toggleBlockUser);

async function searchClient(req: Request, res: Response, next: NextFunction) {
  try {
    const { clientPhone } = req.query;
    if (clientPhone && typeof clientPhone === 'string') {
      const targetClient = await Client.find({
        clientPhone: { $regex: clientPhone.trim(), $options: 'i' },
      });
      return res.send(targetClient);
    }
    return res.status(404).send({ error: 'Для поиска необходим номер телефона.' });
  } catch (e) {
    next(e);
  }
}

async function getAllClients(_req: Request, res: Response, next: NextFunction) {
  try {
    const allClients = await Client.find();
    return res.send(allClients);
  } catch (e) {
    next(e);
  }
}

async function toggleBlockUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch (e) {
      return res.status(404).send({ error: 'Id пользователя должен быть ObjectId.' });
    }

    const targetClient = await Client.findById(_id);

    if (!targetClient) {
      return res.status(400).send({ error: 'Нет клиента с таким ID' });
    }

    targetClient.blocked = !targetClient.blocked;
    await targetClient.save();
    return res.send(targetClient);
  } catch (e) {
    next(e);
  }
}

export default clientRouter;
