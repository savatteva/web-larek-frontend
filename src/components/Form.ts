import { Modal } from './common/Modal'
import { IOrder } from '../types/index'
import { IEvents } from './base/events'
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Form<IOrder> extends Component<IOrder> {
  protected inputs: NodeListOf<HTMLInputElement>;
  protected _form: HTMLFormElement;
  protected submitBtn: HTMLButtonElement;
  protected formName: string;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container)

    this.inputs = this.container.querySelectorAll('.form__input');
    this._form = ensureElement<HTMLFormElement>('.form');
    this.submitBtn = this.container.querySelector('.order__button');

    this._form.addEventListener('submit', (e) => {
      e.preventDefault()
      events.emit(`${this.formName}:submit`)
    })

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof IOrder;
      const value = target.value;
      this.onInputChange(field, value);
    });
  }
  
  protected onInputChange(field: keyof IOrder, value: string) {
    this.events.emit(`${this._form}.${String(field)}:change`, {
        field,
        value
    });
}

  protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

  set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

  close() {
		this._form.reset();
	}
}