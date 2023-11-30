import { ItemEntity, ItemEntityType } from './ItemEntity';
import { VasItemEntity } from './VasItemEntity';

export class DefaultItemEntity extends ItemEntity {
  private subItems: VasItemEntity[] = [];

  getTotalQuantity(): number {
    const subItemQuantity = this.subItems.reduce((total, next) => total + next.quantity, 0);
    return subItemQuantity + this.quantity;
  }
  getUniqueIds(): number[] {
    const subItemIds = this.subItems.map((item) => item.itemId);
    return [...subItemIds, this.itemId];
  }
  addSubItem(item: VasItemEntity) {
    const current = this.subItems.find((sub) => sub.itemId === item.itemId);
    if (!current) {
      this.subItems.push(item);
      return;
    }
    current.increaseQuantity(item.quantity);
  }
  getTotalSubItemQuantity() {
    return this.subItems.reduce((total, next) => total + next.quantity, 0);
  }
  removeChildItem(itemId: number): boolean {
    const index = this.subItems.findIndex((item) => item.itemId === itemId);
    if (index === -1) {
      return false;
    }
    this.subItems.splice(index, 1);
    return true;
  }
  getType() {
    return ItemEntityType.DEFAULT;
  }
  getAmount() {
    const subItemsAmount = this.subItems.reduce((total, next) => total + next.getAmount(), 0);
    return subItemsAmount + this.getPriceWithQuantity();
  }
  getSerializable() {
    return {
      itemId: this.itemId,
      categoryId: this.categoryId,
      sellerId: this.sellerId,
      price: this.price,
      quantity: this.quantity,
      vasItems: this.subItems.map((item) => item.getSerializable()),
    };
  }
}
