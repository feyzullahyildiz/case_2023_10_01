import { CartAggregate } from '../domain/cart/CartAggregate';
import { container } from '../infra/container';
import { CartRepository } from '../domain/cart/CartRepository';

describe('CartAggregate', () => {
  beforeEach(() => {
    const repository = container.resolve<CartRepository>('cartRepository');
    repository.clearAllData();
  });
  it('should create unique Cart with changes', () => {
    const cartA = new CartAggregate();
    expect(cartA.getChanges()).toHaveLength(1);
    const cartB = new CartAggregate(cartA.getChanges());
    expect(cartA.getChanges()).toHaveLength(1);
    expect(cartB.getChanges()).toHaveLength(1);
    cartA.addItem(1, 1, 1, 1, 1);
    // ADDED CalculatePromotionEvent Automatically
    expect(cartA.getChanges()).toHaveLength(3);
    expect(cartB.getChanges()).toHaveLength(1);
    cartB.addItem(1, 1, 1, 1, 1);
    expect(cartA.getChanges()).toHaveLength(3);
    expect(cartB.getChanges()).toHaveLength(3);

    expect(cartA.getTotalQuantity()).toBe(1);
    expect(cartB.getTotalQuantity()).toBe(1);
    cartB.addItem(1, 1, 1, 1, 1);
    cartB.addItem(1, 1, 1, 1, 1);
    expect(cartA.getTotalQuantity()).toBe(1);
    expect(cartB.getTotalQuantity()).toBe(3);
  });
  it('should add Item', () => {
    const cartAggregate = new CartAggregate();
    cartAggregate.addItem(1, 1, 1, 1, 1);
    expect(cartAggregate.getItems()).toHaveLength(1);
  });

  it('should add have 2 quantity in same item', () => {
    const cartAggregate = new CartAggregate();
    cartAggregate.addItem(1, 1, 1, 10, 1);
    cartAggregate.addItem(1, 1, 1, 10, 1);
    const items = cartAggregate.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].getTotalQuantity()).toBe(2);
  });
  it('should 20 quantity in same item', () => {
    const cartAggregate = new CartAggregate();
    cartAggregate.addItem(1, 1, 1, 1, 10);
    cartAggregate.addItem(2, 1, 1, 1, 10);
    expect(cartAggregate.getItems()).toHaveLength(2);
    expect(cartAggregate.getTotalQuantity()).toBe(20);
  });
});
