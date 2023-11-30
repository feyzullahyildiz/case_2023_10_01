import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';
import { ErrorMessages } from '../shared/message';
import { Rules } from '../shared/rules';
import {
  addDigitalItem,
  addDefaultItemWhichDoesNotExceptVas,
  addValidVasItem,
  addVasFriendlyDefaultItem,
} from './test.util';

describe('Add Vas Item', () => {
  beforeEach(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  describe('EventStorming Constraints', () => {
    it('if Actual item is Vas Item. SellerID: 5003 CategoryID: 3242', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 10, 1000, 5);
      expect(cart.getTotalQuantity()).toBe(5);
      const fn = () => cart.addVasItem(10, 99, 99, 99, 99, 1);
      expect(fn).toThrow(ErrorMessages.NOT_VAS_ITEM);
      expect(cart.getTotalQuantity()).toBe(5);

      const { CATEGORY_ID, SELLER_ID } = Rules.ITEM.VAS_ITEM;
      const fn2 = () => cart.addVasItem(10, 99, CATEGORY_ID, 1, 99, 1);
      expect(fn2).toThrow(ErrorMessages.NOT_VAS_ITEM);
      const fn3 = () => cart.addVasItem(10, 99, 1, SELLER_ID, 99, 1);
      expect(fn3).toThrow(ErrorMessages.NOT_VAS_ITEM);
    });
    it('if Ref item is a Default Item', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 100, 1000, 1);
      addDigitalItem(cart, 500, 1000, 1);

      expect(cart.getTotalQuantity()).toBe(2);
      expect(cart.getItems()).toHaveLength(2);

      addValidVasItem(cart, 100, 33);
      expect(cart.getTotalQuantity()).toBe(3);
      const fn = () => addValidVasItem(cart, 500, 33);
      expect(fn).toThrow(ErrorMessages.PARENT_ITEM_NOT_DEFAULT_ITEM);
    });
    it('if Ref item is in Cart', () => {
      const cart = new CartAggregate();
      const fn = () => addValidVasItem(cart, 100, 33);
      expect(fn).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_NOT_FOUND);
    });
    it('if Category ID of Default Item is (1001, 3004)', () => {
      const cart = new CartAggregate();
      cart.addItem(10, Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0], 1, 500, 1);
      cart.addItem(20, Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[1], 1, 500, 1);
      cart.addItem(30, 500, 1, 500, 1);
      expect(cart.getTotalQuantity()).toBe(3);
      expect(cart.getItems()).toHaveLength(3);

      addValidVasItem(cart, 10, 33);
      expect(cart.getTotalQuantity()).toBe(4);
      expect(cart.getItems()).toHaveLength(3);
      addValidVasItem(cart, 20, 44);
      expect(cart.getTotalQuantity()).toBe(5);
      expect(cart.getItems()).toHaveLength(3);

      const fn = () => addValidVasItem(cart, 30, 33);
      expect(fn).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_DEFAULT_ITEM_DOES_NOT_EXPECT_VAS_ITEM);
      expect(cart.getTotalQuantity()).toBe(5);
      expect(cart.getItems()).toHaveLength(3);
    });
    it("if DefaultItem's price higher then Actual Vas Item", () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 10, 999, 1);
      expect(cart.getTotalQuantity()).toBe(1);
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getAmount()).toBe(999);

      addValidVasItem(cart, 10, 333, 999, 1);
      expect(cart.getAmount()).toBe(1998);
      cart.removeItem(333);
      expect(cart.getAmount()).toBe(999);
      const fn = () => addValidVasItem(cart, 10, 333, 999.00001, 1);
      expect(fn).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PRICE_IS_HEIGHER_THAN_PARENT);
      expect(cart.getAmount()).toBe(999);
    });
    it("if DefaultItem's sub item count less then 3", () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 10, 2_000);
      addVasFriendlyDefaultItem(cart, 20, 2_000);
      expect(cart.getTotalQuantity()).toBe(2);
      addValidVasItem(cart, 10, 333, 999, 1);
      addValidVasItem(cart, 10, 333, 999, 1);
      addValidVasItem(cart, 10, 333, 999, 1);
      expect(cart.getTotalQuantity()).toBe(5);
      addValidVasItem(cart, 20, 333, 999, 1);
      addValidVasItem(cart, 20, 333, 999, 1);
      addValidVasItem(cart, 20, 333, 999, 1);
      expect(cart.getTotalQuantity()).toBe(8);

      const fn = () => addValidVasItem(cart, 10, 333, 999, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(8);
      const fn2 = () => addValidVasItem(cart, 10, 444, 999, 1);
      expect(fn2).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(8);
    });
  });
  describe('try to add Vas Item to cart like item', () => {
    it('try with barely VAS item', () => {
      const cart = new CartAggregate();
      const fn = () => cart.addItem(1, Rules.ITEM.VAS_ITEM.CATEGORY_ID, Rules.ITEM.VAS_ITEM.SELLER_ID, 1, 1);
      expect(fn).toThrow(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
    });
    it('try with VAS category, default seller id', () => {
      const cart = new CartAggregate();
      const fn = () => cart.addItem(1, Rules.ITEM.VAS_ITEM.CATEGORY_ID, 1, 1, 1);
      expect(fn).toThrow(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
    });
    it('try with Digital category, VAS seller id', () => {
      const cart = new CartAggregate();
      const fn = () => cart.addItem(1, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, Rules.ITEM.VAS_ITEM.SELLER_ID, 1, 1);
      expect(fn).toThrow(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
    });
    it('try with vas seller id', () => {
      const cart = new CartAggregate();
      const fn = () => cart.addItem(1, 1, Rules.ITEM.VAS_ITEM.SELLER_ID, 1, 1);
      expect(fn).toThrow(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
    });
  });
  describe('Not able to add to parent', () => {
    it('should NOT find DefaultItem', () => {
      const cart = new CartAggregate();
      cart.addItem(1, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(1);
      const fn = () => addValidVasItem(cart, 6, 1);
      expect(fn).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_NOT_FOUND);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('should NOT add to DigitalItem', () => {
      const cart = new CartAggregate();
      expect(cart.getTotalQuantity()).toBe(0);
      addDigitalItem(cart, 55, 100);
      expect(cart.getTotalQuantity()).toBe(1);
      const fn = () => addValidVasItem(cart, 55, 56);
      expect(fn).toThrow(ErrorMessages.PARENT_ITEM_NOT_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('should NOT add to DefaultItem which is not OK VAS item', () => {
      const cart = new CartAggregate();
      expect(cart.getTotalQuantity()).toBe(0);
      addDefaultItemWhichDoesNotExceptVas(cart, 55, 100);
      expect(cart.getTotalQuantity()).toBe(1);
      const fn = () => addValidVasItem(cart, 55, 56);
      expect(fn).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_DEFAULT_ITEM_DOES_NOT_EXPECT_VAS_ITEM);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('should NOT add to Default Item', () => {
      const cart = new CartAggregate();
      expect(cart.getTotalQuantity()).toBe(0);
      addDigitalItem(cart, 55, 100);
      expect(cart.getTotalQuantity()).toBe(1);
      const fn = () => addValidVasItem(cart, 55, 56);
      expect(fn).toThrow(ErrorMessages.PARENT_ITEM_NOT_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('should NOT add, price cannot be higher then its parent', () => {
      const cart = new CartAggregate();
      expect(cart.getTotalQuantity()).toBe(0);
      addVasFriendlyDefaultItem(cart, 10, 2_000);
      expect(cart.getTotalQuantity()).toBe(1);
      // Add same price
      const fn1 = () => addValidVasItem(cart, 10, 20, 2_000);
      expect(fn1).not.toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PRICE_IS_HEIGHER_THAN_PARENT);
      expect(cart.getTotalQuantity()).toBe(2);

      const fn2 = () => addValidVasItem(cart, 10, 20, 2_001);
      expect(fn2).toThrow(ErrorMessages.VAS_ITEM_NOT_ADDED_PRICE_IS_HEIGHER_THAN_PARENT);
      expect(cart.getTotalQuantity()).toBe(2);
    });
  });
  describe('Add Vas Item', () => {
    it('should not add invalid vas item', () => {
      const cart = new CartAggregate();
      cart.addItem(1, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(1);
      const fn1 = () => cart.addVasItem(1, 1, 1, 1, 1, 1);
      expect(fn1).toThrow(ErrorMessages.NOT_VAS_ITEM);

      const fn2 = () => cart.addVasItem(1, 1, 2, 3, 1, 1);
      expect(fn2).toThrow(ErrorMessages.NOT_VAS_ITEM);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('should increase quantity when subitem added', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 10, 100, 5);
      expect(cart.getTotalQuantity()).toBe(5);
      addValidVasItem(cart, 10, 2);
      expect(cart.getTotalQuantity()).toBe(6);
    });
    it('should have most 3 unique VAS item', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1);
      expect(cart.getTotalQuantity()).toBe(1);
      addValidVasItem(cart, 1, 1, 1, 2);
      expect(cart.getTotalQuantity()).toBe(3);
      addValidVasItem(cart, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(4);
      const fn = () => addValidVasItem(cart, 1, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(4);
    });
    it('should have most 3 different VAS item', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 1);
      expect(cart.getTotalQuantity()).toBe(1);

      addValidVasItem(cart, 1, 111);
      expect(cart.getTotalQuantity()).toBe(2);

      addValidVasItem(cart, 1, 111);
      expect(cart.getTotalQuantity()).toBe(3);

      addValidVasItem(cart, 1, 111);
      expect(cart.getTotalQuantity()).toBe(4);

      const fn = () => addValidVasItem(cart, 1, 111);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
      expect(cart.getTotalQuantity()).toBe(4);
    });
    it('should have most 10 vas item in cart', () => {
      const cart = new CartAggregate();
      addVasFriendlyDefaultItem(cart, 10, 1000, 1);
      addValidVasItem(cart, 10, 1033, 20, 3);
      expect(cart.getTotalQuantity()).toBe(4);

      addVasFriendlyDefaultItem(cart, 20, 1000, 1);
      addValidVasItem(cart, 20, 1033, 20, 3);
      expect(cart.getTotalQuantity()).toBe(8);

      addVasFriendlyDefaultItem(cart, 30, 1000, 1);
      addValidVasItem(cart, 30, 1035, 20, 3);
      expect(cart.getTotalQuantity()).toBe(12);

      addVasFriendlyDefaultItem(cart, 40, 1000, 1);
      addValidVasItem(cart, 40, 1036, 20, 1);
      expect(cart.getTotalQuantity()).toBe(14);
      const fn = () => addValidVasItem(cart, 40, 1036, 20, 1);
      expect(fn).toThrow(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_CART);
    });
  });
});
