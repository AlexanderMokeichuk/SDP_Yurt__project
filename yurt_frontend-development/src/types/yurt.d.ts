export interface IYurtMutation {
  title: string;
  description: string;
  pricePerDay: string;
  image: File | null;
}

export interface IYurtFromDb {
  _id: string;
  title: string;
  description: string;
  pricePerDay: number;
  image: string | null;
  blocked: boolean;
}
