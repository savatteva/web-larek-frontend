import { IHomePage, IOrder, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Model } from './base/Model'

export class AppState extends Model<IHomePage> {
  protected _products: IProduct[];
  protected _order: IOrder;
  protected _basket: IProduct[] = [];
  protected _basketTotal: number;
  protected events: IEvents;

  set products(products: IProduct[]) {
    this._products = products;
  }

  get basketTotal() {
    return this._basketTotal
  }

  get order() {
    return this._order
  }

  get basket() {
    return this._basket
  }

  get products() {
    return this._products
  }

  getProduct(productId: string | null) {
    return this._products.find((item) => item.id === productId)
  }

  toBasket(product: IProduct) {
    if(!this._basket.includes(product)) {
      this._basket.push(product)
    }
  }

  deleteFromBasket(product: IProduct) {
    let result = this.basket.filter(item => item.id !== product.id)
    this._basket = result
  }

  setTotal(): number {
    return this.basket.reduce((sum, product) => sum + product.price, 0);
  }  

  setOrderField(field: keyof Omit<IOrder, 'items'>, value: string) {
    this._order[field] = value;
    this.events.emit('order:ready', this._order);
  }
}