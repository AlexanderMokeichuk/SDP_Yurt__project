import { Schema, Types, model } from 'mongoose';
import Yurt from './Yurt';
import User from './User';
import Service from './Service';
import Client from './Client';
import { CommentSchema } from './Comment';

const OrderSchema = new Schema(
  {
    yurt: {
      type: Schema.Types.ObjectId,
      ref: 'Yurt',
      required: [true, 'Выберите юрту!'],
      validate: {
        validator: async (value: Types.ObjectId) => await Yurt.findById(value),
        message: 'Юрта не найдена!',
      },
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Пользователь обязателен'],
      validate: {
        validator: async (value: Types.ObjectId) => await User.findById(value),
        message: 'Пользователь не найден!',
      },
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async (value: Types.ObjectId) => (value ? await User.findById(value) : true),
        message: 'Пользователь не найден!',
      },
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Клиент обязателен'],
      validate: {
        validator: async (value: Types.ObjectId) => await Client.findById(value),
        message: 'Клиент не найден!',
      },
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    prepaid: {
      type: Number,
      default: 0,
    },
    orderDate: {
      type: Date,
      required: [true, 'Дата заказа обязательна!'],
      trim: true,
    },
    createdAt: {
      type: Date,
      required: [true, 'Дата создания заказа обязательна'],
      trim: true,
    },
    updatedAt: {
      type: Date,
      trim: true,
    },
    services: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Service',
          validate: {
            validator: async (value: Types.ObjectId) => await Service.findById(value),
            message: 'Услуга не найдена!',
          },
        },
        serviceTitle: {
          type: String,
          required: true,
        },
        serviceBookingPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    servicesBookingPrice: {
      type: Number,
      default: 0,
    },
    yurtPrice: {
      type: Number,
      required: true,
    },
    commentaries: {
      type: [CommentSchema],
    },
    canceled: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

const Order = model('Order', OrderSchema);

export default Order;
