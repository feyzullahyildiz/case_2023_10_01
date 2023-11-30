import { BaseEntity } from '../../shared/base/BaseEntity';
import { DefaultItemEntity } from '../item/DefaultItemEntity';
import { ItemEntity } from '../item/ItemEntity';
import { VasItemEntity } from '../item/VasItemEntity';

export class CartEntity extends BaseEntity {
  private items: ItemEntity[] = [];
  private promotionId: number | null = null;
  private promotionDiscount: number = 0;
  getAmount() {
    return this.items.reduce((total, next) => total + next.getAmount(), 0);
  }
  addItem(item: ItemEntity) {
    const sameItem = this.items.find((i) => i.getId() === item.getId());
    if (!sameItem) {
      this.items.push(item);
      return;
    }
    sameItem.increaseQuantity(item.quantity);
  }
  getTotalQuantityCount() {
    return this.items.reduce((total, next) => total + next.getTotalQuantity(), 0);
  }
  getItems() {
    return [...this.items];
  }
  addVasItem(vasItem: VasItemEntity) {
    const parent = this.items.find((item) => item.itemId === vasItem.parentId)! as DefaultItemEntity;
    parent.addSubItem(vasItem);
  }
  getItemById(id: number) {
    return this.items.find((item) => item.itemId === id) || null;
  }
  removeItem(itemId: number) {
    const index = this.items.findIndex((item) => item.itemId === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return;
    }
    const someItemsDeleted = this.items.some((item) => {
      const deletResult = item.removeChildItem(itemId);
      return deletResult;
    });
    if (someItemsDeleted) {
      return;
    }
  }
  addPromotion(promotionId: number, discount: number) {
    this.promotionId = promotionId;
    this.promotionDiscount = discount;
  }
  removePromotion() {
    this.promotionId = null;
    this.promotionDiscount = 0;
  }
  getDiscount() {
    return this.promotionDiscount;
  }
  getSerializable() {
    const totalAmount = this.getAmount();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {
      totalAmount,
      items: this.items.map((item) => item.getSerializable()),
      appliedPromotionId: this.promotionId,
      totalDiscount: this.promotionDiscount,
    };
    return obj;
  }
}
