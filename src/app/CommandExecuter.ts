/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError } from '../shared/errors/BaseError';
import { CartAggregate } from '../domain/cart/CartAggregate';
import { ICommand } from './ICommand';
import { IAddItemPayload, IAddVasItemToItemPayload, IRemoveItemPayload } from '../shared/payload';
import { validateAddItemPayload, validateRemoveItem, validateAddVasItemToItemPayload } from './validator';

export class CommandExecuter {
  private cartAggregate: CartAggregate;
  constructor() {
    this.cartAggregate = new CartAggregate();
  }
  private execCommandAndGetResponse(cb: () => any) {
    try {
      const messageObject = cb();
      return {
        result: true,
        message: messageObject,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        return {
          result: false,
          message: error.message,
        };
      }
      return {
        result: true,
        message: error.message || 'Unknown Error',
      };
    }
  }
  private addItem(event: ICommand<IAddItemPayload>) {
    return this.execCommandAndGetResponse(() => {
      const payload = validateAddItemPayload(event.payload);
      return this.cartAggregate.addItem(
        payload.itemId,
        payload.categoryId,
        payload.sellerId,
        payload.price,
        payload.quantity,
      );
    });
  }
  private addVasItemToItem(event: ICommand<IAddVasItemToItemPayload>) {
    return this.execCommandAndGetResponse(() => {
      const payload = validateAddVasItemToItemPayload(event.payload);
      return this.cartAggregate.addVasItem(
        payload.itemId,
        payload.vasItemId,
        payload.vasCategoryId,
        payload.vasSellerId,
        payload.price,
        payload.quantity,
      );
    });
  }
  private removeItem(event: ICommand<IRemoveItemPayload>) {
    return this.execCommandAndGetResponse(() => {
      const payload = validateRemoveItem(event.payload);
      return this.cartAggregate.removeItem(payload.itemId);
    });
  }
  private resetCart() {
    return this.execCommandAndGetResponse(() => {
      return this.cartAggregate.resetCart();
    });
  }
  private displayCart() {
    return this.execCommandAndGetResponse(() => {
      return this.cartAggregate.displayCart();
    });
  }
  public execute(event: ICommand<any>) {
    if (event.command === 'addItem') {
      return this.addItem(event);
    }
    if (event.command === 'addVasItemToItem') {
      return this.addVasItemToItem(event);
    }
    if (event.command === 'removeItem') {
      return this.removeItem(event);
    }
    if (event.command === 'resetCart') {
      return this.resetCart();
    }
    if (event.command === 'displayCart') {
      return this.displayCart();
    }
    return {
      result: false,
      message: 'Unknown command',
    };
  }
}
