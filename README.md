# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточка 

```
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

Оформление заказа

```
interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ICard[];
}
```

Интерфейс для модели данных карточки товара

```
interface ICardsData {
  cards: ICard[];
  preview: string | null;
}
```

Данные карточки, используемые при отображении карточки товара

```
type TCardInfo = Pick<ICard, 'title' | 'price' | 'category' | 'image'>;
```

Данные, используемые при оформлении заказа

```
type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
```

Данные, которые отображаются в корзине

```
type IBasket = Pick<IOrder, 'items' | 'total'>;
```

Данные, которые отображаются в окне подтверждения успешного заказа

```
type ITotal = Pick<IOrder, 'total'>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), в которой презентер связан как с моделью, так и с отображением данных, но они ничего не знают друг о друге:

- слой представление, который отвечает за отображение данных на странице,
- слой данных, который отвечает за хранение и отправление данных на сервер,
- презентер, отвечающий за связь первых двух слоев (то есть слоев представления и данных)

### Базовый код

#### Класс API

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов. 
Методы: 

- `get` - выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает `promise` с объектом, которым ответил сервер

- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST`-запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
Основные методы, реализуемые классом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие. 

### Слой данных

#### Класс CardsData

Класс отвечает за хранение данных и логику работы с данными карточек. Конструктор класса принимает инстант брокера событий. В полях класса хранятся следующие данные: 

- _cards: ICard[] - массив объеков карточки
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных. 

Также класс предоставляет набор методов для взаимодействия с этими данными: 

- getCard(cardId: string): void - открытие модального окна с доп. информацией о карточке
- геттер для получения данных из полей класса

#### Класс OrderData

Класс отвечает за хранение данных и логику работы с корзиной. Конструктор класса принимает инстант брокера событий. В полях класса хранятся следующие данные: 

- payment: string - способ оплаты
- email: string - email
- phone: string - номер телефона
- address: string - адрес доставки
- total: number - сумма заказа
- items: ICard[] - массив выбранных товаров
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных. 

Также класс предоставляет набор методов для взаимодействия с этими данными:

- deleteItem(cardId: string, payload: Function | null): void - удаляет элемент из корзины
- orderItems(items: ICard[]): void - оформление заказа и отправка данных на сервер
- сеттер и геттер для получения данных из полей класса
### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных. 

#### Класс Modal

Реализует модальное окно. Также предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру для закрытия модального окна по нажатию кнопки Esc, клика по оверлею и кнопке-крестику. 

- constructor (selector: string, events: IEvents). Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:

- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalWithOrderForm

Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей поля ввода. При сабмите инициализирует событие, передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для управления активностью кнопки сохранения. 

Поля класса: 

- submitButton: HTMLButtonElement - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы

Методы: 

- setValid (isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, HTMLElement> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные, введенные пользователем
- showInputError (field: string, errorMessage: string):void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError (field: string):void - очищает текст ошибки под указанным полем ввода
- close ():void - расширяет родительский метод, дополнительно очищая поля формы

#### Класс ModalWithItem

Расширяет класс Modal. Предназначен для реализации модального окна с товаром. При сабмите инициализирует событие, добавляя товар в корзину. 

Поля класса: 

- submitButton: HTMLButtonElement - кнопка подтверждения (добавление товара в корзине)

Методы:

- addToCart(id: string): void - добавляет товар в корзину

#### Класс Card

Отвечает за отображение карточки товара, в которой можно посмотреть наименование, стоимость, описание, картинку, категорию. В конструктор класса передается DOM-элемент, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми генерируются соответствующие события. 

Поля класса содержат элементы разметки элементов карточки. Кроме темплейта конструктор принимает экземпляр `EventEmitter` для инициации событий. 

Методы: 

- геттер id возвращает уникальный id карточки товара
- render() - HTMLElement возвращает полностью заполненную карточку с установленными слушателями

#### Класс CardsContainer

Отвечает за отображение блока с карточками на главной странице. Предоставляет сеттер `container` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки. 

### Слой коммуникаций 

#### Класс AppApi

Принимает в конструктор экземпляр класса Api и представляет методы, реализующие взаимодействие с бэкендом сервиса

## Взаимодействия компонентов 

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющий роль презентера. 

Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`. 

В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий. 

*Список всех событий, которые могут генерироваться в системе:*

- `card:selected` - изменение открываемой в модальном окне картинки карточки товара
- `card:modalClear` - очистка выбранного id для показа в модальном окне

*События, возникающие при взаимодействии пользователя с интерйесом (генерируются классами, отвечающими за представление):*

- `card:select` - выбор карточки для отображения в модальном окне
- `order:open` - открытие модального окна с заказом
- `order:input` - изменение данных в форме с заказом
- `order:validation` - событие, сообщающее о необходимости валидации формы заказа
- `newPurchases:submit` - 