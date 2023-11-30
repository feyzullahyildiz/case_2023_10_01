import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { CalculatePromotionEvent } from '../events';
import { Rules } from '../rules';

export class CalculatePromotionEventHandler extends BaseEventHandler<CalculatePromotionEvent> {
  cartRepository: CartRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public context: any) {
    super('CalculatePromotionEvent');
    this.cartRepository = context.cartRepository as CartRepository;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTry() {}
  private getDiscount(id: number, cb: () => number) {
    const discount = cb();
    return { id, discount };
  }
  private getCategoryPromotion(uuid: string) {
    const items = this.cartRepository.getItems(uuid);
    const promotion = Rules.ITEM.PROMOTION.CATEGORY_PROMOTION;
    return this.getDiscount(promotion.ID, () => {
      const promotedItems = items.filter((item) => item.categoryId === promotion.CATEGORY_ID);
      if (promotedItems.length === 0) {
        return 0;
      }
      const amount = promotedItems.map((item) => item.getAmount()).reduce((total, next) => total + next, 0);
      return (promotion.DISCOUNT_PERCENTAGE * amount) / 100;
    });
  }
  private getSameSellerPromotion(uuid: string) {
    const items = this.cartRepository.getItems(uuid);
    const promotion = Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION;
    return this.getDiscount(promotion.ID, () => {
      const active = new Set(items.map((item) => item.sellerId)).size === 1;

      // Bunu koymam gerektiğini düşündüm.
      // If the seller of the items in the Cart is the same (excluding VasItems)
      if (items.length < 2) {
        return 0;
      }
      if (!active) {
        return 0;
      }
      // Only for the default and digital items
      // VAS items excluded
      const amount = items.map((item) => item.price).reduce((total, next) => total + next, 0);
      return (promotion.DISCOUNT_PERCENTAGE * amount) / 100;
    });
  }
  private getTotalPricePromotion(uuid: string) {
    const amount = this.cartRepository.getAmount(uuid);
    const promotion = Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION;
    return this.getDiscount(promotion.ID, () => {
      return promotion.DISCOUNT_FUN(amount);
    });
  }

  onCommit(uuid: string): void {
    const categoryPromotion = this.getCategoryPromotion(uuid);
    const sameSellerPromotion = this.getSameSellerPromotion(uuid);
    const totalPricePromotion = this.getTotalPricePromotion(uuid);

    const selectedPromotion = [categoryPromotion, sameSellerPromotion, totalPricePromotion].sort((a, b) =>
      a.discount < b.discount ? 1 : -1,
    )[0];
    if (selectedPromotion.discount === 0) {
      this.cartRepository.removePromotion(uuid);
      return;
    }
    // APPLY PROMOTION TO CART
    this.cartRepository.applyPromotion(uuid, selectedPromotion.id, selectedPromotion.discount);
    return;
  }
}
