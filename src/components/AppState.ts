import { IHomePage, IOrder, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Model } from './base/Model'

export class AppState extends Model<IHomePage> {
  protected _products: IProduct[];
  protected _order: IOrder = {
    payment: "",
    email: "",
    phone: "",
    'address': "",
    items: [],
    total: 0
  };
  protected _basket: IProduct[] = [];
  protected events: IEvents;

  set products(products: IProduct[]) {
    this._products = products;
  }

  set order(order: IOrder) {
    this._order = order;
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

  clearBasket() {
    this._basket.splice(0, this._basket.length)
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

  setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
    this._order[field] = value;
    this.events.emit('order:ready', this._order);
  }
}