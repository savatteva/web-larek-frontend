import { IEvents } from './base/events';
import { Form } from './common/Form';
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

    this.cash.addEventListener('click', () => {
      this.toggleClass(this.cash, 'button_alt-active')
      if (this.card.classList.contains('button_alt-active')) {
        this.toggleClass(this.card, 'button_alt-active')
      }
      this.setPayment(this.cash);
    })

    this.card.addEventListener('click', () => {
      this.toggleClass(this.card, 'button_alt-active')
      if (this.cash.classList.contains('button_alt-active')) {
        this.toggleClass(this.cash, 'button_alt-active')
      }
      this.setPayment(this.card);
    })
  };
  
    set address(value: string) {
      this._address.value = value;
    }

    setPayment(button: HTMLButtonElement) {
      if (button.classList.contains('button_alt-active') && button.getAttribute('name') === 'card') {
        this._payment = 'card'
      } else {
        this._payment = 'cash'
      }

      this.events.emit('payment:choosed', { payment: this._payment })
    }
}