import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';
import { ErrorMessages } from '../shared/message';
import { Rules } from '../shared/rules';
import { addDigitalItem, addValidVasItem, addVasFriendlyDefaultItem } from './test.util';

describe('AddItem', () => {
  beforeEach(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  describe('EventStorming Constraints', () => {
    it('if not VAS item', () => {
      const cart = new CartAggregate();
      expect(cart.getTotalQuantity()).toBe(0);
      const fn = () => cart.addItem(1, Rules.ITEM.VAS_ITEM.CATEGORY_ID, Rules.ITEM.VAS_ITEM.SELLER_ID, 100, 1);
      expect(fn).toThrow(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
      expect(cart.getTotalQuantity()).toBe(0);
    });
    it('if DigitalItem and total DigitalItem count in Cart less then 5', () => {
      const cart = new CartAggregate();
      addDigitalItem(cart, 1, 100, 1);
      expect(cart.getTotalQuantity()).toBe(1);
      addDigitalItem(cart, 2, 100, 2);
      expect(cart.getTotalQuantity()).toBe(3);
      addDigitalItem(cart, 3, 100, 2);
      expect(cart.getTotalQuantity()).toBe(5);
      const fn = () => addDigitalItem(cart, 4, 100, 1);
      expect(fn).toThrow(ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED);
      expect(cart.getTotalQuantity()).toBe(5);
    });
    /**
     * IQ:
     * ITEM's QUANTITY; Quantity value of actual item
     */
    it('if IQ less then 10', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1, 100, 5);
      expect(cart.getTotalQuantity()).toBe(5);
      addVasFriendlyDefaultItem(cart, 1, 100, 5);
      expect(cart.getTotalQuantity()).toBe(10);
      expect(cart.getItems()).toHaveLength(1);
      const fn = () => addVasFriendlyDefaultItem(cart, 1, 100, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_VALUE_EXCEEDED_FOR_ITEM);
    });
    /**
     * UIC:
     * UNIQUE ITEM COUNT without counting quantity value
     */
    it('if UIC less then 10', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1, 100, 1);
      addVasFriendlyDefaultItem(cart, 2, 100, 1);
      addVasFriendlyDefaultItem(cart, 3, 100, 1);
      expect(cart.getTotalQuantity()).toBe(3);
      expect(cart.getItems()).toHaveLength(3);
      addVasFriendlyDefaultItem(cart, 4, 100, 1);
      addVasFriendlyDefaultItem(cart, 5, 100, 1);
      addVasFriendlyDefaultItem(cart, 6, 100, 1);
      addVasFriendlyDefaultItem(cart, 7, 100, 1);
      addVasFriendlyDefaultItem(cart, 8, 100, 1);
      addVasFriendlyDefaultItem(cart, 9, 100, 1);
      addVasFriendlyDefaultItem(cart, 10, 100, 1);
      expect(cart.getTotalQuantity()).toBe(10);
      const fn = () => addVasFriendlyDefaultItem(cart, 11, 100, 1);
      expect(fn).toThrow(ErrorMessages.MAX_UNIQUE_TEM_COUNT_IN_CART_EXCEEDED);
      expect(cart.getTotalQuantity()).toBe(10);
      const fn2 = () => addValidVasItem(cart, 1, 999, 50, 2);
      expect(fn2).not.toThrow(ErrorMessages.MAX_UNIQUE_TEM_COUNT_IN_CART_EXCEEDED);
      expect(cart.getItems()).toHaveLength(10);
      expect(cart.getTotalQuantity()).toBe(12);
    });
    /**
     * TIVIC:
     * TOTAL ITEM COUNT INCLUDING VAS;
     * Count of ALL Default Item and
     * Digital Item and
     * Vas Item
     */
    it('if TIVIC less then 30', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1, 1000, 2);
      addVasFriendlyDefaultItem(cart, 2, 1000, 2);
      addVasFriendlyDefaultItem(cart, 3, 1000, 2);
      addVasFriendlyDefaultItem(cart, 4, 1000, 2);
      addVasFriendlyDefaultItem(cart, 5, 1000, 2);
      expect(cart.getTotalQuantity()).toBe(10);
      expect(cart.getAmount()).toBe(10_000);
      addVasFriendlyDefaultItem(cart, 1, 1000, 3);
      addVasFriendlyDefaultItem(cart, 2, 1000, 3);
      addVasFriendlyDefaultItem(cart, 3, 1000, 3);
      addVasFriendlyDefaultItem(cart, 4, 1000, 3);
      addVasFriendlyDefaultItem(cart, 5, 1000, 3);
      expect(cart.getItems()).toHaveLength(5);
      expect(cart.getTotalQuantity()).toBe(25);

      addValidVasItem(cart, 1, 33, 100, 3);
      expect(cart.getTotalQuantity()).toBe(28);
      const fn = () => addValidVasItem(cart, 1, 33, 100, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);

      addValidVasItem(cart, 2, 55, 100, 1);
      expect(cart.getTotalQuantity()).toBe(29);
      addValidVasItem(cart, 2, 55, 100, 1);
      expect(cart.getTotalQuantity()).toBe(30);

      const fn1 = () => addValidVasItem(cart, 2, 55, 100, 1);
      expect(fn1).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_IN_CART_EXCEEDED);

      const fn2 = () => addVasFriendlyDefaultItem(cart, 5, 1000, 3);
      expect(fn2).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_IN_CART_EXCEEDED);

      expect(cart.getTotalQuantity()).toBe(30);

      cart.removeItem(33);
      expect(cart.getTotalQuantity()).toBe(27);
      addValidVasItem(cart, 1, 33, 100, 2);
      expect(cart.getTotalQuantity()).toBe(29);
      const fn3 = () => addValidVasItem(cart, 2, 33, 100, 2);
      expect(fn3).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(29);
      addValidVasItem(cart, 2, 55, 100, 1);
      expect(cart.getTotalQuantity()).toBe(30);
      const fn4 = () => addDigitalItem(cart, 200);
      expect(fn4).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_IN_CART_EXCEEDED);
      expect(cart.getTotalQuantity()).toBe(30);
    });
    /**
     * AMOUNT:
     * Total price value after most efficent promotion applied
     */
    it('if AMOUNT less then 500.000₺', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1, 50_000, 2);
      expect(cart.getAmount()).toBe(100_000);
      addVasFriendlyDefaultItem(cart, 2, 50_000, 2);
      addVasFriendlyDefaultItem(cart, 3, 50_000, 2);
      addVasFriendlyDefaultItem(cart, 4, 50_000, 2);
      addVasFriendlyDefaultItem(cart, 5, 50_000, 2);
      expect(cart.getAmount()).toBe(500_000);
      expect(cart.getTotalQuantity()).toBe(10);
      const fn = () => addVasFriendlyDefaultItem(cart, 99, 1, 1);
      expect(fn).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      cart.removeItem(99);
      expect(cart.displayCart()).toMatchObject({
        appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        totalDiscount: 25000,
      });
      addVasFriendlyDefaultItem(cart, 99, 25000, 1);
      // Total Discount increased
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 525_000,
        appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        totalDiscount: 27500,
      });
      cart.removeItem(99);
      expect(cart.displayCart()).toMatchObject({
        totalAmount: 500_000,
        appliedPromotionId: Rules.ITEM.PROMOTION.SAME_SELLER_PROMOTION.ID,
        totalDiscount: 25000,
      });
      const fn2 = () => addVasFriendlyDefaultItem(cart, 99, 28000, 1);
      expect(fn2).toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(cart.getAmount()).toBe(500_000);
      cart.removeItem(1);
      expect(cart.getAmount()).toBe(400_000);
      const fn3 = () => addVasFriendlyDefaultItem(cart, 1, 50_000, 3);
      expect(fn3).toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(cart.getAmount()).toBe(400_000);
    });
  });
  describe('Total Amount limit 500.000 TL', () => {
    it('should add a single item 500.000', () => {
      const cart = new CartAggregate();
      expect(() => cart.addItem(1, 1, 1, 500_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(cart.getAmount()).toBe(500_000);
    });
    it('should not valid when item price is above 500.000 TL', () => {
      const cart = new CartAggregate();
      expect(() => cart.addItem(1, 1, 1, 500_001, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      cart.removeItem(1);
      expect(() => cart.addItem(1, 1, 1, 502_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      cart.removeItem(1);
      expect(() => cart.addItem(1, 1, 1, 502_000.001, 1)).toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
    });
    it('should add item one-by-one until exceeds 500.000 TL (2000 discount)', () => {
      const cart = new CartAggregate();
      expect(() => cart.addItem(1, 1, 1, 100_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(2, 1, 2, 100_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(3, 1, 3, 100_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(4, 1, 4, 100_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(5, 1, 5, 100_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(6, 1, 6, 2_000, 1)).not.toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
      expect(() => cart.addItem(7, 1, 7, 0.00001, 1)).toThrow(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
    });
  });
  describe('Digital Item Limit', () => {
    it('should not add new item after 5', () => {
      const cart = new CartAggregate();
      expect(() => cart.addItem(1, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).not.toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
      expect(() => cart.addItem(2, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).not.toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
      expect(() => cart.addItem(3, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).not.toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
      expect(() => cart.addItem(4, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).not.toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
      expect(() => cart.addItem(5, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).not.toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
      expect(() => cart.addItem(6, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 100, 1)).toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
    });
    it('should not add new item after 5', () => {
      const cart = new CartAggregate();
      expect(() => cart.addItem(1, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, 1, 1, 6)).toThrow(
        ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED,
      );
    });
  });
  describe('Total Quantity', () => {
    it('should max 30 item in Cart', () => {
      const cart = new CartAggregate();
      for (let i = 0; i < 30; i++) {
        cart.addItem((i % 10) + 1, 1, 1, 20, 1);
      }
      expect(cart.getItems()).toHaveLength(10);
      expect(() => cart.addItem(1, 1, 1, 20, 1)).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_IN_CART_EXCEEDED);
    });
    it('should have max quantity 10', () => {
      const cart = new CartAggregate();
      cart.addItem(1, 1, 1, 1, 9);
      expect(cart.getTotalQuantity()).toBe(9);
      cart.addItem(1, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(10);
      const fn = () => cart.addItem(1, 1, 1, 1, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_QUANTITY_VALUE_EXCEEDED_FOR_ITEM);
      expect(cart.getTotalQuantity()).toBe(10);
    });
  });
  describe('Unique Item Count', () => {
    it('should have 10 unique, 12 total quantity', () => {
      const cart = new CartAggregate();
      for (let i = 0; i < 10; i++) {
        cart.addItem(i + 1, 1, 1, 20, 1);
      }
      expect(cart.getTotalQuantity()).toBe(10);
      cart.addItem(1, 1, 1, 20, 1);
      expect(cart.getTotalQuantity()).toBe(11);
      expect(() => cart.addItem(100, 1, 1, 20, 1)).toThrow(ErrorMessages.MAX_UNIQUE_TEM_COUNT_IN_CART_EXCEEDED);
      cart.addItem(2, 1, 1, 20, 1);
      expect(cart.getTotalQuantity()).toBe(12);
    });
  });
  describe('Add item', () => {
    it('should add an item looks like VAS', () => {});
  });
});
