import { IEvents } from '../base/events'
import { Component } from '../base/Component';

export class Form<IOrder> extends Component<IOrder> {
  protected _form: HTMLFormElement;
  protected submitBtn: HTMLButtonElement;
  protected formName: string;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container)

    this._form = container.querySelector('.form');
    this.submitBtn = this.container.querySelector('.order__button');

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof IOrder;
      const value = target.value;
      this.onInputChange(field, value);
    });
  }
  
  protected onInputChange(field: keyof IOrder, value: string) {
    this.events.emit(`${String(field)}:change`, {
      field,
      value
    });

}

  close() {
		this._form.reset();
	}
}