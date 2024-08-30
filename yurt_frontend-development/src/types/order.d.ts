import { IYurtFromDb } from '~/types/yurt';
import { IServiceWithBookingPrice } from './service';
import dayjs from 'dayjs';

export interface IOrderMutation {
  yurt: string;
  clientName: string;
  clientPhone: string;
  prepaid: number;
  orderDate: Date;
  services: string[];
  commentaries: ICommentMutation[] | null;
}

export interface IOrderMutationEdit extends IOrderMutation {
  yurt: { value: string; label: string };
}

export interface IOrderToSend extends IOrderMutation {
  orderDate: string;
}

interface ICommentMutation {
  text: string;
}

interface IComment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
}

export interface IOrderFromDb {
  _id: string;
  yurt: Omit<IYurtFromDb, 'description'>;
  yurtPrice: number;
  client: {
    _id: string;
    clientName: string;
    clientPhone: string;
    blocked: boolean;
  };
  createdBy: {
    _id: string;
    username: string;
    phoneNumber: string;
  };
  totalPrice: number;
  prepaid: number;
  orderDate: string;
  createdAt: string;
  services: IServiceWithBookingPrice[];
  servicesBookingPrice: number;
  commentaries: IComment[];
  canceled: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface IDateOrder {
  _id: string;
  orderDate: Date;
  yurt?: Omit<IYurtFromDb, 'description'>;
  client?: {
    _id: string;
    clientName: string;
    clientPhone: string;
    blocked: boolean;
  };
  service?: IServiceWithBookingPrice;
}

export interface IRangeDatesMutation {
  dateFrom: dayjs.Dayjs | undefined;
  dateTo: dayjs.Dayjs | undefined;
}

export interface IOrderForSMS {
  yurt: string;
  clientName: string;
  clientPhone: string;
  orderDate: string;
  prepaid: number;
  totalPrice: number;
}

export interface IOrderError {
  error: {
    ru: string;
    kg: string;
  };
}
