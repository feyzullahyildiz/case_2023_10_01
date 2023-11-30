import { CartAggregate } from '../../domain/cart/CartAggregate';
import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEvent } from '../base';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { ItemNotFoundToRemoveError } from '../errors';
import { CalculatePromotionEvent, RemoveItemEvent } from '../events';

export class RemoveItemEventHandler extends BaseEventHandler<RemoveItemEvent> {
  cartRepository: CartRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public context: any) {
    super('RemoveItemEvent');
    this.cartRepository = context.cartRepository as CartRepository;
  }
  onTry(event: RemoveItemEvent, actualEvents: BaseEvent[]) {
    // Cloning current Cart
    const tempCart = new CartAggregate(actualEvents);
    const itemExists = this.cartRepository.isItemExists(tempCart.uuid, event.payload.itemId);
    if (!itemExists) {
      throw new ItemNotFoundToRemoveError();
    }

    tempCart.commitEvent(event);
  }
  onCommit(uuid: string, event: RemoveItemEvent, cartAggregate: CartAggregate) {
    this.cartRepository.removeItem(uuid, event.payload.itemId);
    const promotionEvent = new CalculatePromotionEvent(uuid);
    cartAggregate.commitEvent(promotionEvent);
  }
}
