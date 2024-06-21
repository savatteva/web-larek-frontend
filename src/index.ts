import './scss/styles.scss';
import { EventEmitter } from './components/base/events'
import { API_URL, CDN_URL } from './utils/constants'
import { LarekApi } from './components/LarekAPI'
import { IProduct } from './types';
import { Product } from './components/Product'
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductsContainer } from './components/ProductsContainer'
import { AppState } from './components/AppState'
import { Modal } from './components/common/Modal'
import { Basket } from './components/Basket'
import { Form } from './components/Form'
import { Order } from './components/Order'
import { Contacts } from './components/Contacts'
import { IOrder } from './types/index'
import { Success } from './components/Success'

const events = new EventEmitter(); // создание экземпляра брокера событий

const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const productContainer = new ProductsContainer(document.querySelector('.gallery'))
const basketBtn = document.querySelector('.header__basket');
const basketCounter = document.querySelector('.header__basket-counter');

basketBtn.addEventListener('click', () => {
  events.emit('basket:open');
})

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const modalPreview = ensureElement<HTMLTemplateElement>('#card-preview');

const productInBasket = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new LarekApi(CDN_URL, API_URL);

const appState = new AppState({}, events);

api.getProducts()
.then(res => {
  appState.products = res;
  events.emit('products:loaded', res);
})

events.on('products:loaded', () => {
  const productsArray = appState.products.map(product =>{
    const initialProduct = new Product('card', cloneTemplate(cardCatalog), {
      onClick: () => events.emit('card:select', product)
  });

    return initialProduct.render({
      image: product.image,
      title: product.title,
      category: product.category,
      price: product.price,
    });
  })

  productContainer.render({catalog: productsArray})
})

events.on('card:select', (item: IProduct) => {
  const preview = new Product('card', cloneTemplate(modalPreview), {
    onClick: () => {
      if (appState.basket.includes(item)) {
        events.emit('card:deletefromcart', item)
        preview.button.textContent = 'В корзину'
      } else {
        events.emit('card:addtocart', item)
        preview.button.textContent = 'Удалить из корзины'
      }
    }
  })
  
  if (!appState.basket.includes(item)) {
    preview.button.textContent = 'В корзину'
  } else {
    preview.button.textContent = 'Удалить из корзины'
  }

  modal.render({
    content: preview.render({
      image: item.image,
      title: item.title,
      category: item.category,
      price: item.price,
      description: item.description
    })
  })
})

events.on('card:addtocart', (item: IProduct) => {
  appState.toBasket(item);
  basketCounter.textContent = String(appState.basket.length)
})

events.on('modal:open', () => {
  document.querySelector('.page__wrapper').classList.add('page__wrapper_locked');
})

events.on('modal:close', () => {
  document.querySelector('.page__wrapper').classList.remove('page__wrapper_locked');
})

const basket = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new Basket(cloneTemplate(basket), events)

events.on('basket:open', () => {
  const products = appState.basket.map((item, index) => {
    const product = new Product('card', cloneTemplate(productInBasket), {
      onClick: () => {
        events.emit('card:deletefromcart', item)
      }})

      return product.render({
        price: item.price,
        title: item.title,
        id: item.id,
        index: index += 1
      })
  })
  modal.render({
    content: basketView.render({
      products, 
      total: appState.setTotal(),
      selected: products.length
    })
  })
})

events.on('card:deletefromcart', (item: IProduct) => {
  appState.deleteFromBasket(item);
  basketCounter.textContent = String(appState.basket.length);

  events.emit('basket:open')
})

const order = ensureElement<HTMLTemplateElement>('#order');
const orderView = new Order(cloneTemplate(order), events);

const contacts = ensureElement<HTMLTemplateElement>('#contacts')
const contactsView = new Contacts(cloneTemplate(contacts), events);
  
events.on('order:open', () => {
  appState.order.total = appState.setTotal()
  appState.order.items = appState.basket.map(item => item.id)
  modal.render({
    content: orderView.render({})
  })

  console.log(appState)
})

events.on(/.*:change/, (data: { field: keyof Omit<IOrder, 'items' | 'total'>, value: string }) => {
  appState.setOrderField(data.field, data.value);
});

events.on('payment:choosed', (data: { payment: string }) => {
  appState.setOrderField('payment', data.payment)
})

events.on('order:submit', () => {
  modal.render({
    content: contactsView.render({})
  })
})

const success = ensureElement<HTMLTemplateElement>('#success');

events.on('contacts:submit', () => {

  api.orderProducts(appState.order)
  .then(result => {
    const successView = new Success(cloneTemplate(success), { onClick: () => { 
      modal.close() 
      appState.clearBasket()
      basketCounter.textContent = String(appState.basket.length)
      appState.order = { 
        payment: "",
        email: "",
        phone: "",
        address: "",
        items: [],
        total: 0
      } 
    }});

    modal.render({
      content: successView.render({
        total: appState.order.total
      })
    });
  })
  .catch(err => console.log(err)) 

}) 

events.onAll((event) => {
  console.log(event.eventName, event.data);
}) // слежка за всеми событиями 