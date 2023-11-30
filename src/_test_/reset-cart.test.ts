import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';

describe('Reset Cart', () => {
  beforeAll(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  it('add item Some items and Reset Cart', () => {
    const cart = new CartAggregate();
    expect(cart.getTotalQuantity()).toBe(0);
    cart.addItem(1, 1, 1, 10, 1);
    expect(cart.getTotalQuantity()).toBe(1);
    expect(cart.getAmount()).toBe(10);
    cart.addItem(1, 1, 1, 10, 1);
    expect(cart.getAmount()).toBe(20);
    cart.resetCart();
    expect(cart.getTotalQuantity()).toBe(0);
    expect(cart.getAmount()).toBe(0);
  });
});
