export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  addToCart(cardId: string): void;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ICard[];
  deleteItem(cardId: string, payload: Function | null): void; 
  orderItems(items: ICard[]): void;
}

export interface ICardsData {
  cards: ICard[];
  preview: string | null;
  getCard(cardId: string): void;
}

export type TCardInfo = Pick<ICard, 'title' | 'price' | 'category' | 'image'>;

export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

export type IBasket = Pick<IOrder, 'items' | 'total'>;

export type ITotal = Pick<IOrder, 'total'>;

