import { ObjectId } from 'mongodb';
import { ICommentary } from './comment';
import { IServiceWithBookingPrice } from './service';

export interface IOrderMutation {
  yurt: string;
  yurtPrice: number;
  createdBy: ObjectId;
  updatedBy: ObjectId | null;
  client: ObjectId;
  totalPrice: number;
  prepaid: number;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  servicesBookingPrice: number | null;
  services: IServiceWithBookingPrice[];
  commentaries: ICommentary[];
}

export interface IOrderMutationFromDb extends IOrderMutation {
  _id: string;
}

export interface IDateOrder {
  _id: string;
  orderDate: Date;
  service: IServiceWithBookingPrice;
}
