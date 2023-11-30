import { BaseRepository } from '../../shared/base/BaseRepository';
import { CartEntity } from './CartEntity';
import { Rules } from '../../shared';
import { ItemEntity } from '../item/ItemEntity';
import { DigitalItemEntity } from '../item/DigitalItemEntity';
import { DefaultItemEntity } from '../item/DefaultItemEntity';
import { VasItemEntity } from '../item/VasItemEntity';
import { IAddItemPayload, IAddVasItemToItemPayload } from '../../shared/payload';

export class CartRepository extends BaseRepository<CartEntity> {
  getItemEntityFromPayload(payload: IAddItemPayload): ItemEntity {
    const { itemId, categoryId, sellerId, price, quantity } = payload;
    if (payload.categoryId === Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID) {
      return new DigitalItemEntity(itemId, categoryId, sellerId, price, quantity);
    }
    return new DefaultItemEntity(itemId, categoryId, sellerId, price, quantity);
  }
  getVasItem(payload: IAddVasItemToItemPayload): VasItemEntity {
    const { itemId, vasCategoryId, vasSellerId, vasItemId, price, quantity } = payload;
    return new VasItemEntity(itemId, vasItemId, vasCategoryId, vasSellerId, price, quantity);
  }
  initEntity(uuid: string) {
    this.add(uuid, new CartEntity());
  }
  addItemToCart(uuid: string, item: ItemEntity) {
    const cartEntity = this.getById(uuid);
    cartEntity.addItem(item);
  }
  addVasItemToItem(uuid: string, item: VasItemEntity) {
    const cartEntity = this.getById(uuid);
    cartEntity.addVasItem(item);
  }
  getAmount(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getAmount();
  }
  getDiscountCalculatedAmount(uuid: string) {
    const cartEntity = this.getById(uuid);
    const amount = cartEntity.getAmount();
    const discount = cartEntity.getDiscount();
    return amount - discount;
  }
  getTotalQuantity(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getTotalQuantityCount();
  }

  getItemEntity<T extends ItemEntity>(uuid: string, itemId: number): null | T {
    const cartEntity = this.getById(uuid);
    return cartEntity.getItemById(itemId) as T | null;
  }
  getItemQuantity(uuid: string, itemId: number) {
    const item = this.getItemEntity(uuid, itemId);
    if (!item) {
      return null;
    }
    return item.getTotalQuantity();
  }
  getItems(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getItems();
  }
  resetCart(uuid: string) {
    this.delete(uuid);
    this.initEntity(uuid);
  }
  clearAllData() {
    this.clear();
  }
  getDigitalItems(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getItems().filter((item) => item.categoryId === Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID);
  }

  getDigitalItemQuantity(uuid: string) {
    const items = this.getDigitalItems(uuid);
    const value = items.reduce((total, next) => total + next.getTotalQuantity(), 0);
    return value;
  }
  getAllUniqueIdList(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity
      .getItems()
      .map((item) => item.getUniqueIds())
      .flat(1);
  }
  getParentItemOnlyDistinctIdList(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getItems().map((item) => item.getId());
  }
  isItemExists(uuid: string, itemId: number) {
    const arr = this.getAllUniqueIdList(uuid);
    return arr.includes(itemId);
  }
  removeItem(uuid: string, itemId: number) {
    const cartEntity = this.getById(uuid);
    cartEntity.removeItem(itemId);
  }
  getDefaultItems(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getItems().filter((item) => item.isDefaultItem()) as DefaultItemEntity[];
  }
  getTotalSubItemQuantityInCart(uuid: string) {
    const items = this.getDefaultItems(uuid);
    return items.reduce((total, next) => total + next.getTotalSubItemQuantity(), 0);
  }
  getSerializable(uuid: string) {
    const cartEntity = this.getById(uuid);
    return cartEntity.getSerializable();
  }
  applyPromotion(uuid: string, promotionId: number, discount: number) {
    const cartEntity = this.getById(uuid);
    cartEntity.addPromotion(promotionId, discount);
  }
  removePromotion(uuid: string) {
    const cartEntity = this.getById(uuid);
    cartEntity.removePromotion();
  }
}
