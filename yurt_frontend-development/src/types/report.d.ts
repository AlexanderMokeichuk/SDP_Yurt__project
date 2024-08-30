import { IYurtFromDb } from '~/types/yurt';
import { IServiceWithBookingPrice } from '~/types/service';
import { IComment } from '~/types/order';

export interface IReportFromDb {
  _id: string;
  yurt: Omit<IYurtFromDb, 'description'>;
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
  commentaries: IComment[];
  canceled: boolean;
  servicesBookingPrice: number;
  yurtPrice: number;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface IDates {
  dateFrom: Date;
  dateTo: Date;
}

export interface IDatesRequest {
  dateFrom: string;
  dateTo: string;
}
