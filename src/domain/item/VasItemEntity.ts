import { ItemEntity, ItemEntityType } from './ItemEntity';

export class VasItemEntity extends ItemEntity {
  constructor(
    public parentId: number,
    itemId: number,
    categoryId: number,
    sellerId: number,
    price: number,
    quantity: number,
  ) {
    super(itemId, categoryId, sellerId, price, quantity);
  }
  getType() {
    return ItemEntityType.VAS;
  }
  getSerializable() {
    return {
      vasItemId: this.itemId,
      vasCategoryId: this.categoryId,
      vasSellerId: this.sellerId,
      price: this.price,
      quantity: this.quantity,
    };
  }
}
