import { CartAggregate } from '../domain/cart/CartAggregate';
import { Rules } from '../shared';

export const addValidVasItem = (
  cart: CartAggregate,
  parent: number,
  id: number,
  price: number = 100,
  quantity: number = 1,
) => {
  const vasCategoryId = Rules.ITEM.VAS_ITEM.CATEGORY_ID;
  const vasSellerId = Rules.ITEM.VAS_ITEM.SELLER_ID;
  cart.addVasItem(parent, id, vasCategoryId, vasSellerId, price, quantity);
  return {
    id,
    vasCategoryId,
    vasSellerId,
  };
};
export const addVasItemAddableDefaultItem = (
  cart: CartAggregate,
  id: number,
  price: number = 1000,
  quantity: number = 1,
) => {
  cart.addItem(id, Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0], 1, price, quantity);
};
export const addDigitalItem = (
  cart: CartAggregate,
  id: number,
  price: number = 1000,
  quantity: number = 1,
  sellerId: number = 1,
) => {
  cart.addItem(id, Rules.ITEM.DIGITAL_ITEM.CATEGORY_ID, sellerId, price, quantity);
};

export const addVasFriendlyDefaultItem = (
  cart: CartAggregate,
  id: number,
  price: number = 1000,
  quantity: number = 1,
  sellerId: number = 1,
) => {
  const categoryId = Rules.ITEM.DEFAULT_ITEM.VAS_ITEM_ALLOWED_CATEGORY_IDS[0];
  cart.addItem(id, categoryId, sellerId, price, quantity);
  return {
    id,
    categoryId,
    sellerId,
    price,
    quantity,
  };
};
export const addDefaultItemWhichDoesNotExceptVas = (
  cart: CartAggregate,
  id: number,
  price: number = 1000,
  quantity: number = 1,
) => {
  cart.addItem(id, 500, 9999, price, quantity);
};

export const addCategoryPromoted = (
  cart: CartAggregate,
  id: number,
  price: number = 30,
  quantity: number = 1,
  sellerId: number = 1,
) => {
  const categoryId = Rules.ITEM.PROMOTION.CATEGORY_PROMOTION.CATEGORY_ID;
  cart.addItem(id, categoryId, sellerId, price, quantity);
  return {
    id,
    categoryId,
    sellerId,
    price,
    quantity,
  };
};
