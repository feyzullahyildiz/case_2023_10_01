import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';
import { addCategoryPromoted, addDigitalItem, addValidVasItem, addVasFriendlyDefaultItem } from './test.util';
import { Rules } from '../shared';

describe('Display Cart', () => {
  beforeAll(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  it('add item Some items and Reset Cart', () => {
    const cart = new CartAggregate();
    expect(cart.displayCart()).toMatchObject({
      items: [],
      totalAmount: 0,
      totalDiscount: 0,
      appliedPromotionId: null,
    });
  });
  it('should show DefaultItem', () => {
    const cart = new CartAggregate();
    const { sellerId, categoryId } = addVasFriendlyDefaultItem(cart, 10, 30, 4);
    expect(cart.displayCart()).toMatchObject({
      items: [
        {
          itemId: 10,
          categoryId: categoryId,
          sellerId: sellerId,
          price: 30,
          quantity: 4,
          vasItems: [],
        },
      ],
      totalAmount: 120,
      totalDiscount: 0,
      appliedPromotionId: null,
    });
    const { vasSellerId, vasCategoryId } = addValidVasItem(cart, 10, 70, 20, 1);
    expect(cart.displayCart()).toMatchObject({
      items: [
        {
          itemId: 10,
          categoryId: categoryId,
          sellerId: sellerId,
          price: 30,
          quantity: 4,
          vasItems: [
            {
              vasItemId: 70,
              vasCategoryId,
              vasSellerId,
              price: 20,
              quantity: 1,
            },
          ],
        },
      ],
      totalAmount: 140,
      totalDiscount: 0,
      appliedPromotionId: null,
    });
    addValidVasItem(cart, 10, 70, 10, 1);
    expect(cart.displayCart()).toMatchObject({
      items: [
        {
          itemId: 10,
          categoryId: categoryId,
          sellerId: sellerId,
          price: 30,
          quantity: 4,
          vasItems: [
            {
              vasItemId: 70,
              vasCategoryId,
              vasSellerId,
              price: 20,
              quantity: 2, //Updated
            },
          ],
        },
      ],
      totalAmount: 160, //Updated
      totalDiscount: 0,
      appliedPromotionId: null,
    });
    addValidVasItem(cart, 10, 99, 30, 1);
    expect(cart.displayCart()).toMatchObject({
      items: [
        {
          itemId: 10,
          categoryId: categoryId,
          sellerId: sellerId,
          price: 30,
          quantity: 4,
          vasItems: [
            {
              vasItemId: 70,
              vasCategoryId,
              vasSellerId,
              price: 20,
              quantity: 2,
            },
            //Updated START
            {
              vasItemId: 99,
              vasCategoryId,
              vasSellerId,
              price: 30,
              quantity: 1,
            },
            //Updated END
          ],
        },
      ],
      totalAmount: 190, //Updated
      totalDiscount: 0,
      appliedPromotionId: null,
    });
    addVasFriendlyDefaultItem(cart, 10, 30, 1);
    expect(cart.displayCart()).toMatchObject({
      items: [
        {
          itemId: 10,
          categoryId: categoryId,
          sellerId: sellerId,
          price: 30,
          quantity: 5, //Updated
          vasItems: [
            {
              vasItemId: 70,
              vasCategoryId,
              vasSellerId,
              price: 20,
              quantity: 2,
            },
            {
              vasItemId: 99,
              vasCategoryId,
              vasSellerId,
              price: 30,
              quantity: 1,
            },
          ],
        },
      ],
      totalAmount: 220, //Updated
      totalDiscount: 0,
      appliedPromotionId: null,
    });
  });
  describe('Promotions', () => {
    it('should add total price promotion', () => {
      const cart = new CartAggregate();
      expect(cart.displayCart()).toMatchObject({
        items: [],
        totalAmount: 0,
        totalDiscount: 0,
        appliedPromotionId: null,
      });

      addVasFriendlyDefaultItem(cart, 10, 2500, 1, 100);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 2500,
        totalDiscount: 250,
        appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
      });
      addVasFriendlyDefaultItem(cart, 10, 2500, 3, 100);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 10000,
        totalDiscount: 1000,
        appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
      });
      addVasFriendlyDefaultItem(cart, 20, 6000, 3, 100);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 28000,
        totalDiscount: 1000,
        appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
      });
      cart.removeItem(10);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 18000,
        totalDiscount: 1000,
        appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
      });
      cart.removeItem(20);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 0,
        totalDiscount: 0,
        appliedPromotionId: null,
      });
    });
    it('should not invoke same-seller promotion for multi quanatity with one item', () => {
      const cart = new CartAggregate();
      expect(cart.displayCart()).toMatchObject({
        items: [],
        totalAmount: 0,
        totalDiscount: 0,
        appliedPromotionId: null,
      });
      addVasFriendlyDefaultItem(cart, 10, 45, 1, 1702);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 45,
        totalDiscount: 0,
        appliedPromotionId: null,
      });
      addVasFriendlyDefaultItem(cart, 10, 45, 3, 1702);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 180,
        totalDiscount: 0,
        appliedPromotionId: null,
      });
    });
    describe('Same Seller Promotion Sequential Test', () => {
      let cart: CartAggregate = null;
      const sellerId = 1702;
      beforeAll(() => {
        cart = new CartAggregate('AA');
      });
      it('should add same seller promotion', () => {
        addDigitalItem(cart, 10, 45, 1, sellerId);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 45,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
        addVasFriendlyDefaultItem(cart, 15, 35, 1, sellerId);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 80,
          totalDiscount: 8,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
      });
      it('should save old cart state', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 80,
          totalDiscount: 8,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
      });
      it('should not change discount when VAS added', () => {
        addValidVasItem(cart, 15, 99, 10);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 90,
          totalDiscount: 8,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
        addValidVasItem(cart, 15, 99, 10);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 100,
          totalDiscount: 8,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
      });
      it('should remove promotion when digital item removed', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 100,
          totalDiscount: 8,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
        cart.removeItem(10);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 55,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
      });
    });

    describe('Total Price Promotion Sequential Test', () => {
      let cart: CartAggregate = null;
      beforeAll(() => {
        cart = new CartAggregate('AA');
      });
      it('should add promotion when amount is 250', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 0,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
        addDigitalItem(cart, 100, 250, 1, 700);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 250,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
        addDigitalItem(cart, 100, 250, 1, 700);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 500,
          totalDiscount: 250,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should set discount to 500', () => {
        addDigitalItem(cart, 100, 250, 2, 700);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 1000,
          totalDiscount: 250,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
        addVasFriendlyDefaultItem(cart, 202, 5000, 1, 999);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 6000,
          totalDiscount: 500,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should decrease discount to 250', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 6000,
          totalDiscount: 500,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
        cart.removeItem(202);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 1000,
          totalDiscount: 250,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should increase discount to 2000', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 1000,
          totalDiscount: 250,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
        addVasFriendlyDefaultItem(cart, 203, 49500, 1, 1999);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 50500,
          totalDiscount: 2000,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should decrease discount to 1000', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 50500,
          totalDiscount: 2000,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
        cart.removeItem(100);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 49500,
          totalDiscount: 1000,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
    });
    describe('Category Promotion Sequential Test', () => {
      let cart: CartAggregate = null;
      beforeAll(() => {
        cart = new CartAggregate('AA');
      });
      it('should add promotion discount: 1.5', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 0,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
        addCategoryPromoted(cart, 100, 30, 1, 100_001);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 30,
          totalDiscount: 1.5,
          appliedPromotionId: Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.ID,
        });
      });
      it('should not change discount when NON-promoted-category-item added', () => {
        addDigitalItem(cart, 2, 50, 1, 500_000);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 80,
          totalDiscount: 1.5,
          appliedPromotionId: Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.ID,
        });
      });

      it('should increase discount when PROMOTED-category-item added', () => {
        addCategoryPromoted(cart, 200, 270, 1, 100_002);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 350,
          totalDiscount: 15,
          appliedPromotionId: Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.ID,
        });
      });
    });
    describe('Promotion Changes Sequential Test', () => {
      let cart: CartAggregate = null;
      beforeAll(() => {
        cart = new CartAggregate('AA');
      });
      it('should set Total Price promotion', () => {
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 0,
          totalDiscount: 0,
          appliedPromotionId: null,
        });
        addDigitalItem(cart, 5, 5_000, 1, 999_999);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 5_000,
          totalDiscount: 500,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should set Same Seller Promotion', () => {
        addDigitalItem(cart, 10, 1_000, 1, 999_999);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 6_000,
          totalDiscount: 600,
          appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        });
      });
      it('should set Total Price promotion', () => {
        addVasFriendlyDefaultItem(cart, 50, 1_000, 4, 999_999);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 10_000,
          totalDiscount: 1_000,
          appliedPromotionId: Rules.ITEM.PROMOTION.TOTAL_PRICE_PROMOTION.ID,
        });
      });
      it('should set Category promotion', () => {
        addCategoryPromoted(cart, 888, 5_000, 6, 333_333);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 40_000,
          totalDiscount: 1_500,
          appliedPromotionId: Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.ID,
        });
      });
      it('should set Category promotion', () => {
        addCategoryPromoted(cart, 999, 15_000, 1, 333_333);
        expect(cart.displayCart()).toMatchObject({
          totalAmount: 55_000,
          totalDiscount: 45000 / 20,
          appliedPromotionId: Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.ID,
        });
      });
    });
  });
});
