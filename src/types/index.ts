export interface IHomePage {
  catalog: IProduct[];
  basket: string[];
  order: IOrder | null;
  basketTotal: number; 
  preview: string | null;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index:  number;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  'address': string;
  items: string[];
  total: number;
}

export interface IProductsData {
  products: IProduct[];
  preview: string | null;
  getProduct(cardId: string): void;
}

export interface IApi {
  getProducts: () => Promise<IProduct[]>
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;