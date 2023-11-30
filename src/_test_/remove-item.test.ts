import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';
import { ErrorMessages } from '../shared/message';
import { addVasItemAddableDefaultItem, addValidVasItem } from './test.util';

describe('Remove Item', () => {
  beforeAll(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  describe('Add/Remove Scenerio Sequential', () => {
    let cart: CartAggregate = null;
    beforeAll(() => {
      const repository = container.resolve<CartRepository>('cartRepository');
      repository.clearAllData();
      cart = new CartAggregate('b20c4124-5be6-4e44-a464-e4f426513811');
    });
    it('add item A', () => {
      expect(cart.getTotalQuantity()).toBe(0);
      cart.addItem(1, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(1);
    });
    it('remove item A', () => {
      expect(cart.getTotalQuantity()).toBe(1);
      cart.removeItem(1);
      expect(cart.getTotalQuantity()).toBe(0);
    });
    it('remove item B with 2 quantity and clear cart', () => {
      expect(cart.getTotalQuantity()).toBe(0);
      cart.addItem(2, 1, 1, 1, 2);
      expect(cart.getTotalQuantity()).toBe(2);
      cart.removeItem(2);
      expect(cart.getTotalQuantity()).toBe(0);
    });
    it('remove item B with 2 quantity and clear cart', () => {
      expect(cart.getTotalQuantity()).toBe(0);
      cart.addItem(1, 1, 1, 1, 2);
      expect(cart.getItems()).toHaveLength(1);
      cart.addItem(2, 1, 1, 1, 2);
      expect(cart.getItems()).toHaveLength(2);
      expect(cart.getTotalQuantity()).toBe(4);
      cart.addItem(2, 1, 1, 1, 1);
      expect(cart.getTotalQuantity()).toBe(5);
      expect(cart.getItems()).toHaveLength(2);

      cart.removeItem(2);
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getTotalQuantity()).toBe(2);
    });
    it('remove default and vas item', () => {
      expect(cart.getTotalQuantity()).toBe(2);
      addVasItemAddableDefaultItem(cart, 10);
      expect(cart.getTotalQuantity()).toBe(3);
      addValidVasItem(cart, 10, 100);
      expect(cart.getTotalQuantity()).toBe(4);
      cart.removeItem(10);
      expect(cart.getTotalQuantity()).toBe(2);
    });
    it('remove Vas item only', () => {
      expect(cart.getTotalQuantity()).toBe(2);
      addVasItemAddableDefaultItem(cart, 999);
      expect(cart.getTotalQuantity()).toBe(3);
      // TODO cart getMedhods returned values need to be immutable
      // We need to return new instance for every time

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = cart.getItems().find((item: any) => item.itemId === 999);
      expect(item).toHaveProperty('subItems');

      expect(item.subItems).toHaveLength(0);

      expect(cart.getTotalQuantity()).toBe(3);
      addValidVasItem(cart, 999, 666);
      // FIXME I can change the data here :D
      expect(item.subItems).toHaveLength(1);

      expect(cart.getTotalQuantity()).toBe(4);
      // We have multi Default Items in current cart.
      // Every default item should not have this value in their subitems
      const fn = () => cart.removeItem(11111);
      // We get all ids before. If there is not item in it.
      // We throw this error.
      expect(fn).toThrow(ErrorMessages.ITEM_NOT_FOUND_TO_REMOVE);
      cart.removeItem(666);

      // FIXME I can change the data here :D
      expect(item.subItems).toHaveLength(0);

      expect(cart.getTotalQuantity()).toBe(3);
      cart.removeItem(1);
      expect(cart.getTotalQuantity()).toBe(1);
      cart.removeItem(999);
      expect(cart.getTotalQuantity()).toBe(0);
      expect(cart.getAmount()).toBe(0);
    });
  });
});
