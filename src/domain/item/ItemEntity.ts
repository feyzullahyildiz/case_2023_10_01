import { BaseEntity } from '../../shared/base/BaseEntity';

// TODO Change this class position
// FIXME Update entity logic
export abstract class ItemEntity extends BaseEntity {
  constructor(
    public readonly itemId: number,
    public readonly categoryId: number,
    public readonly sellerId: number,
    public readonly price: number,
    public quantity: number,
  ) {
    super();
  }
  getId() {
    return this.itemId;
  }
  getAmount() {
    return this.getPriceWithQuantity();
  }
  getPriceWithQuantity() {
    return this.price * this.quantity;
  }
  increaseQuantity(append: number = 1) {
    this.quantity += append;
  }
  getTotalQuantity() {
    return this.quantity;
  }
  getUniqueIds() {
    return [this.itemId];
  }
  // If found and removed, we need return true
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  removeChildItem(itemId: number): boolean {
    return false;
  }
  abstract getType(): ItemEntityType;
  isVasItem() {
    return this.getType() === ItemEntityType.VAS;
  }
  isDefaultItem() {
    return this.getType() === ItemEntityType.DEFAULT;
  }
  isDigitalItem() {
    return this.getType() === ItemEntityType.DIGITAL;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSerializable(): any {
    return {
      itemId: this.itemId,
      categoryId: this.categoryId,
      sellerId: this.sellerId,
      price: this.price,
      quantity: this.quantity,
    };
  }
}
export enum ItemEntityType {
  DEFAULT,
  DIGITAL,
  VAS,
}
