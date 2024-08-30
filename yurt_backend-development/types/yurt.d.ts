import { ObjectId } from 'mongoose';

export interface IYurtMutation {
  title: string;
  description?: string;
  pricePerDay: number;
  image: string | null;
  blocked: boolean;
}

export interface IYurtFromDb extends IYurtMutation {
  _id: ObjectId;
}
