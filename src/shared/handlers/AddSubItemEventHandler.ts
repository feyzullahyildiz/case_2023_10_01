import { DefaultItemEntity } from '../../domain/item/DefaultItemEntity';
import { CartAggregate } from '../../domain/cart/CartAggregate';
import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEvent } from '../base';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { IPayload } from '../base/IPayload';
import {
  MaxAmountInCartExceededError,
  MaxItemExceededError,
  MaxVasQuanityExceededInCartError,
  MaxVasQuanityExceededInDefaultItemError,
  NotVasItemError,
  ParentItemIsNotDefaultItemError,
  VasItemNotAddedDefaultItemDoesNotExpectVasItemError,
  VasItemNotAddedParentItemNotFoundError,
  VasItemNotAddedPriceIsHeigherThanParentError,
} from '../errors';
import { AddSubItemEvent, CalculatePromotionEvent } from '../events';
import { Rules } from '../rules';

export class AddSubItemEventHandler extends BaseEventHandler<AddSubItemEvent> {
  cartRepository: CartRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public context: any) {
    super('AddSubItemEvent');
    this.cartRepository = context.cartRepository as CartRepository;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTry(event: AddSubItemEvent, actualEvents: BaseEvent<IPayload>[]) {
    const isVasCategory = event.payload.vasCategoryId === Rules.ITEM.VAS_ITEM.CATEGORY_ID;
    const isVasSeller = event.payload.vasSellerId === Rules.ITEM.VAS_ITEM.SELLER_ID;
    const isValidVasItem = isVasCategory && isVasSeller;
    if (!isValidVasItem) {
      throw new NotVasItemError();
    }

    // Cloning current Cart
    const clonedCart = new CartAggregate(actualEvents);

    const parentItem = this.cartRepository.getItemEntity(clonedCart.uuid, event.payload.itemId);
    if (!parentItem) {
      throw new VasItemNotAddedParentItemNotFoundError();
    }
    if (!parentItem.isDefaultItem()) {
      throw new ParentItemIsNotDefaultItemError();
    }
    const allowedCategories = Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS;
    const isVasAddableCategory = allowedCategories.includes(parentItem.categoryId);
    if (!isVasAddableCategory) {
      throw new VasItemNotAddedDefaultItemDoesNotExpectVasItemError();
    }
    if (event.payload.price > parentItem.getPriceWithQuantity()) {
      throw new VasItemNotAddedPriceIsHeigherThanParentError();
    }
    // Adding new Event without condition to the Cart
    clonedCart.commitEvent(event);

    const discountAddedAmount = this.cartRepository.getDiscountCalculatedAmount(clonedCart.uuid);
    if (discountAddedAmount > Rules.MAX_ALLOWED_AMOUNT_LIMIT_IN_CART) {
      throw new MaxAmountInCartExceededError();
    }
    const nextParentItem = this.cartRepository.getItemEntity<DefaultItemEntity>(clonedCart.uuid, event.payload.itemId)!;
    // CHECK TOTAL SubItemQuantity in DefaultItem
    const nextSubItemTotalInDefaultItem = nextParentItem.getTotalSubItemQuantity();
    if (nextSubItemTotalInDefaultItem > Rules.MAX_ALLOWED_VAS_QUANTITY_IN_DEFAULT_ITEM) {
      throw new MaxVasQuanityExceededInDefaultItemError();
    }
    // CHECK TOTAL VAS Item Quantity in Cart
    const nextTotalSubItemCountInCart = this.cartRepository.getTotalSubItemQuantityInCart(clonedCart.uuid);
    if (nextTotalSubItemCountInCart > Rules.MAX_ALLOWED_VAS_QUANTITY_IN_CART) {
      throw new MaxVasQuanityExceededInCartError();
    }
    const totalQuantity = this.cartRepository.getTotalQuantity(clonedCart.uuid);
    if (totalQuantity > Rules.MAX_ALLOWED_ITEM_COUNT_IN_CART) {
      throw new MaxItemExceededError();
    }
  }
  onCommit(uuid: string, event: AddSubItemEvent, cartAggregate: CartAggregate): void {
    const vasEvntity = this.cartRepository.getVasItem(event.payload);
    this.cartRepository.addVasItemToItem(uuid, vasEvntity);

    const promotionEvent = new CalculatePromotionEvent(uuid);
    cartAggregate.commitEvent(promotionEvent);
  }
}
