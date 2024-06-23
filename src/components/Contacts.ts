import { IEvents } from './base/events';
import { Form } from './common/Form'
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class Contacts extends Form<IOrder> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container)
    this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container)
  }

  set phone(value: string) { 
    this._phone.value = value;
  }

  set email(value: string) {
    this._email.value = value;
  }
}