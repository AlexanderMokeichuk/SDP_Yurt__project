import { Types } from 'mongoose';

export interface IService {
  title: string;
  price: number;
  blocked: boolean;
}

export interface IServiceMutation {
  title: string;
  price: string;
}

export interface IServiceWithBookingPrice {
  _id: Types.ObjectId;
  serviceTitle: string;
  serviceBookingPrice: number;
}
