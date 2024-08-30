import { Schema, model } from 'mongoose';
import { IYurtMutation } from '../types/yurt';

const YurtSchema = new Schema<IYurtMutation>(
  {
    title: {
      type: String,
      required: [true, 'Поле заголовка обязательно!'],
      trim: true,
    },
    description: {
      type: String || null,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Введите цену!'],
      validate: {
        validator: (price: number) => price > 0,
        message: 'Цена должна быть больше нуля!',
      },
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Поле ввода картинки обязательно!'],
      trim: true,
    },
    blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false },
);

const Yurt = model('Yurt', YurtSchema);

export default Yurt;
