import { Schema, model } from 'mongoose';
import { IClient } from '../types/client';

const ClientSchema = new Schema<IClient>(
  {
    clientName: {
      type: String,
      required: [true, 'Имя клиента обязательно!'],
      trim: true,
    },
    clientPhone: {
      type: String,
      required: [true, 'Введите номер телефона!'],
      unique: true,
      trim: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

const Client = model('Client', ClientSchema);

export default Client;
