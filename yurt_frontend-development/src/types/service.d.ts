export interface IServiceMutation {
  title: string;
  price: string;
}

export interface IService {
  _id: string;
  title: string;
  price: string;
  blocked: boolean;
}

export interface IServiceFromDb extends IService {
  _id: string;
}

export interface IServiceWithBookingPrice {
  _id: string;
  serviceTitle: string;
  serviceBookingPrice: number;
}
