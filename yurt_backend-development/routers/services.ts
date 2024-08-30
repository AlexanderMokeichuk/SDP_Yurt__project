import express, { NextFunction, Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import auth from '../middleware/Auth';
import Service from '../models/Service';
import { IServiceMutation } from '../types/service';
import permit from '../middleware/Permit';

const serviceRouter = express.Router();

serviceRouter.post('/', auth, permit(['admin', 'owner']), createService);
serviceRouter.get('/', auth, getServices);
serviceRouter.patch('/:id', auth, permit(['admin', 'owner']), updateService);
serviceRouter.patch(
  '/toggleBlockService/:id',
  auth,
  permit(['admin', 'owner']),
  toggleBlockService,
);

async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const serviceData: IServiceMutation = {
      title: req.body.title,
      price: req.body.price,
    };

    const service = new Service({
      title: serviceData.title,
      price: serviceData.price ? parseFloat(serviceData.price) : null,
    });

    await service.save();
    return res.send(service);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(422).send({ error: e });
    }

    next(e);
  }
}

async function getServices(req: Request, res: Response, next: NextFunction) {
  const unblockedServices = req.query.unblockedServices as string;
  try {
    if (unblockedServices) {
      const services = await Service.find({ blocked: false });
      return res.send(services);
    }

    const services = await Service.find();
    return res.send(services);
  } catch (e) {
    next(e);
  }
}

async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const _id = new Types.ObjectId(req.params.id);
    const { title, price } = req.body;

    const updateService = await Service.updateOne(
      { _id },
      {
        $set: {
          title,
          price: parseFloat(price) || price,
        },
      },
    );

    if (updateService.matchedCount === 0) {
      return res.status(404).send({ error: 'Услуга не найдена!' });
    }

    const updatedService = await Service.findById(_id);

    return res.status(200).send({ updatedService, message: 'Редактирование прошло успешно!' });
  } catch (e) {
    next(e);
  }
}

async function toggleBlockService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) return res.status(404).send({ error: 'Услуга не найдена' });

    service.blocked = !service.blocked;
    await service.save();
    return res.send(service);
  } catch (e) {
    next(e);
  }
}

export default serviceRouter;
