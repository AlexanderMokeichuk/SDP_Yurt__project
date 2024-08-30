import express, { NextFunction, Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import auth from '../middleware/Auth';
import { clearImages, imagesUpload } from '../multer';
import Yurt from '../models/Yurt';
import { IYurtFromDb, IYurtMutation } from '../types/yurt';
import permit from '../middleware/Permit';

const yurtsRouter = express.Router();

yurtsRouter.post('/', auth, permit(['admin', 'owner']), imagesUpload.single('image'), createYurt);
yurtsRouter.get('/', auth, getYurts);
yurtsRouter.get('/:id', auth, getByIdYurt);
yurtsRouter.patch(
  '/:id',
  auth,
  permit(['admin', 'owner']),
  imagesUpload.single('image'),
  updateYurt,
);
yurtsRouter.patch('/toggleBlockYurt/:id', auth, permit(['admin', 'owner']), toggleBlockYurt);

async function createYurt(req: Request, res: Response, next: NextFunction) {
  try {
    const yurtData: Omit<IYurtMutation, 'blocked'> = {
      title: req.body.title,
      description: req.body.description,
      pricePerDay: req.body.pricePerDay,
      image: req.file ? req.file.filename : null,
    };

    const yurt = new Yurt(yurtData);

    await yurt.save();
    return res.send(yurt);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(422).send({ error: e });
    }

    next(e);
  }
}

async function getYurts(req: Request, res: Response, next: NextFunction) {
  const unblockedYurts = req.query.unblockedYurts as string;
  try {
    if (unblockedYurts) {
      const yurts: IYurtFromDb[] = await Yurt.find({ blocked: false });
      return res.send(yurts);
    }

    const yurts: IYurtFromDb[] = await Yurt.find();
    return res.send(yurts);
  } catch (e) {
    next(e);
  }
}

async function getByIdYurt(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const { id } = req.params;

    const yurt: IYurtFromDb | null = await Yurt.findById(id);

    if (!yurt) return res.status(404).send({ error: 'Юрта не найдена' });

    return res.send(yurt);
  } catch (e) {
    next(e);
  }
}

async function updateYurt(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const _id = new Types.ObjectId(req.params.id);
    const { title, description, pricePerDay } = req.body;

    const targetYurt = await Yurt.findById(_id);
    if (!targetYurt) res.status(400).send({ error: 'Нет юрты с таким ID' });

    if (targetYurt) {
      targetYurt.title = title;
      targetYurt.description = description;
      targetYurt.pricePerDay = pricePerDay;
      if (req.file?.filename) {
        targetYurt.image = req.file.filename;
      }
      await targetYurt.save();
    }

    return res.status(200).send(targetYurt);
  } catch (e) {
    if (req.file) {
      clearImages(req.file.filename);
    }

    next(e);
  }
}

async function toggleBlockYurt(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }

    const { id } = req.params;
    const yurt = await Yurt.findById(id);

    if (!yurt) return res.status(404).send({ error: 'Юрта не найдена' });

    yurt.blocked = !yurt.blocked;
    await yurt.save();
    return res.send(yurt);
  } catch (e) {
    next(e);
  }
}

export default yurtsRouter;
