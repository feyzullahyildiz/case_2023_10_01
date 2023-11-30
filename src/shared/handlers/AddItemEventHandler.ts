import { CartAggregate } from '../../domain/cart/CartAggregate';
import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEvent } from '../base';
import { BaseEventHandler } from '../base/BaseEventHandler';
import {
  MaxDigitalItemExceededError,
  MaxAmountInCartExceededError,
  MaxItemExceededError,
  MaxIUniqueItemExceededError,
  MaxQuanityExceededForItemError,
  UnexpectedItemItLooksLikeVasItemError,
} from '../errors';
import { AddItemEvent, CalculatePromotionEvent } from '../events';
import { Rules } from '../rules';

export class AddItemEventHandler extends BaseEventHandler<AddItemEvent> {
  cartRepository: CartRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public context: any) {
    super('AddItemEvent');
    this.cartRepository = context.cartRepository as CartRepository;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTry(event: AddItemEvent, actualEvents: BaseEvent[]) {
    const isVasSellerId = event.payload.sellerId === Rules.ITEM.VAS_ITEM.SELLER_ID;
    const isVasCategoryId = event.payload.categoryId === Rules.ITEM.VAS_ITEM.CATEGORY_ID;
    if (isVasCategoryId || isVasSellerId) {
      throw new UnexpectedItemItLooksLikeVasItemError();
    }
    // Cloning current Cart
    const clonedCart = new CartAggregate(actualEvents);
    // Adding new Event without condition to the Cart
    clonedCart.commitEvent(event);
    // Now, we can check items in the cloned
    const discountAddedAmount = this.cartRepository.getDiscountCalculatedAmount(clonedCart.uuid);
    if (discountAddedAmount > Rules.MAX_ALLOWED_AMOUNT_LIMIT_IN_CART) {
      throw new MaxAmountInCartExceededError();
    }
    const totalDigitalItemQuantity = this.cartRepository.getDigitalItemQuantity(clonedCart.uuid);
    if (totalDigitalItemQuantity > Rules.MAX_ALLOWED_DIGITAL_ITEM_COUNT_IN_CART) {
      throw new MaxDigitalItemExceededError();
    }
    const totalQuantity = this.cartRepository.getTotalQuantity(clonedCart.uuid);
    if (totalQuantity > Rules.MAX_ALLOWED_ITEM_COUNT_IN_CART) {
      throw new MaxItemExceededError();
    }
    const uniqueIdList = this.cartRepository.getParentItemOnlyDistinctIdList(clonedCart.uuid);
    if (uniqueIdList.length > Rules.MAX_ALLOWED_UNIQUE_ITEM_COUNT_IN_CART) {
      throw new MaxIUniqueItemExceededError();
    }
    const itemQuantity = this.cartRepository.getItemQuantity(clonedCart.uuid, event.payload.itemId);
    if (itemQuantity === null || itemQuantity > Rules.MAX_ALLOWED_QUANTITY_VALUE_FOR_ITEM) {
      throw new MaxQuanityExceededForItemError();
    }
  }
  onCommit(uuid: string, event: AddItemEvent, cartAggregate: CartAggregate) {
    const item = this.cartRepository.getItemEntityFromPayload(event.payload);
    this.cartRepository.addItemToCart(uuid, item);
    const promotionEvent = new CalculatePromotionEvent(uuid);
    cartAggregate.commitEvent(promotionEvent);
  }
}
