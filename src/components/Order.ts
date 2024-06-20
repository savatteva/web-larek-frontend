import { EventEmitter, IEvents } from './base/events';
import { Form } from './Form';
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class Order extends Form<IOrder> {
  protected cash: HTMLButtonElement;
  protected card: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _payment: string;

  constructor(container: HTMLFormElement, events: IEvents)  {
    super(container, events)

    this.cash = this.container.querySelector('button[name="cash"]');
    this.card = this.container.querySelector('button[name="card"]');

    this._address = container.querySelector<HTMLInputElement>('input[name="address"]');
    
    this.submitBtn.addEventListener('click', () => {
      events.emit('order:submit')
    })

    this.cash.addEventListener('click', () => {
      this.cash.classList.add('button_alt-active');
      this.card.classList.remove('button_alt-active');
      this.setPayment(this.cash);
      this.events.emit('payment:choosed', {payment: this._payment})
    })

    this.card.addEventListener('click', () => {
      this.card.classList.add('button_alt-active');
      this.cash.classList.remove('button_alt-active');
      this.setPayment(this.card);
      this.events.emit('payment:choosed', {payment: this._payment})
    })

    this._address.addEventListener('input', () => {
      if (this.card.classList.contains('button_alt-active') || this.cash.classList.contains('button_alt-active') ) {
        this.submitBtn.removeAttribute('disabled')
      }
    })

  };
  
    set address(value: string) {
      this._address.value = value;
    }

    setPayment(button: HTMLButtonElement) {
      if(button.classList.contains('button_alt-active')) {
        this._payment = 'card'
      } else {
        this._payment = 'cash'
      }
    }
}