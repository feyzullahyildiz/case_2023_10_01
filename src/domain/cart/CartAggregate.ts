import { AggregateRoot, AggregateRootConstructorParam } from '../../shared/base/AggregateRoot';
import {
  AddItemEvent,
  GetItemsEvent,
  CartCreatedEvent,
  GetAllQuantityEvent,
  GetAmountEvent,
  AddSubItemEvent,
  RemoveItemEvent,
  ResetCartEvent,
  DisplayCartEvent,
} from '../../shared/events';
import { IAddItemPayload, IAddVasItemToItemPayload, IRemoveItemPayload } from '../../shared/payload';

export class CartAggregate extends AggregateRoot {
  constructor(params: AggregateRootConstructorParam = null) {
    super(params);
    if (this.getChanges().length === 0) {
      this.commitEvent(new CartCreatedEvent());
    }
  }
  addItem(itemId: number, categoryId: number, sellerId: number, price: number, quantity: number) {
    const payload: IAddItemPayload = {
      itemId,
      categoryId,
      price,
      quantity,
      sellerId,
    };
    const event = new AddItemEvent(payload);
    this.tryEvent(event);
    this.commitEvent(event);
    return 'addItem succeed';
  }
  addVasItem(
    itemId: number,
    vasItemId: number,
    vasCategoryId: number,
    vasSellerId: number,
    price: number,
    quantity: number,
  ) {
    const payload: IAddVasItemToItemPayload = {
      itemId,
      vasItemId,
      vasCategoryId,
      price,
      quantity,
      vasSellerId,
    };
    const event = new AddSubItemEvent(payload);
    this.tryEvent(event);
    this.commitEvent(event);
    return 'addVasItemToItem succeed';
  }
  removeItem(itemId: number) {
    const payload: IRemoveItemPayload = {
      itemId,
    };
    const event = new RemoveItemEvent(payload);
    this.tryEvent(event);
    this.commitEvent(event);
    return 1;
  }
  displayCart() {
    const event = new DisplayCartEvent();
    this.tryEvent(event);
    return this.commitEvent(event);
  }
  resetCart() {
    const event = new ResetCartEvent();
    this.tryEvent(event);
    this.commitEvent(event);
  }
  getItems() {
    const event = new GetItemsEvent();
    this.tryEvent(event);
    return this.commitEvent(event);
  }
  getTotalQuantity() {
    const event = new GetAllQuantityEvent();
    this.tryEvent(event);
    return this.commitEvent(event);
  }
  getAmount(): number {
    const event = new GetAmountEvent();
    this.tryEvent(event);
    return this.commitEvent(event);
  }
  public tryEvent = super.tryEvent;
  public commitEvent = super.commitEvent;
}
