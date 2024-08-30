import { Schema, model } from 'mongoose';
import { IService } from '../types/service';

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Поле заголовка обязательно!'],
      trim: true,
    },
    price: {
      type: Number,
      validate: {
        validator: (price: number | null) => (price ? price > 0 : 0),
        message: 'Цена должна быть больше нуля!',
      },
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

const Service = model('Service', ServiceSchema);

export default Service;
