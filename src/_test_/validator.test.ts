import { validateAddItemPayload, validateAddVasItemToItemPayload, validateRemoveItem } from '../app/validator';
import { ErrorMessages } from '../shared/message';

describe('CommandReaderAndResultWriter', () => {
  describe('validateAddItemPayload', () => {
    it('should not throw', () => {
      expect(() =>
        validateAddItemPayload({
          itemId: 1,
          categoryId: 1,
          sellerId: 1,
          price: 1,
          quantity: 1,
        }),
      ).not.toThrow(ErrorMessages.INVALID_PAYLOAD);
    });
    it('should throw', () => {
      const fn = () =>
        validateAddItemPayload({
          itemId: '1',
          categoryId: 1,
          sellerId: 1,
          price: 1,
          quantity: 1,
        });
      expect(() => fn).not.toThrow(ErrorMessages.INVALID_PAYLOAD);
      expect(fn()).toMatchObject({
        itemId: 1,
      });
    });
  });
  describe('validateAddVasItemToItemPayload', () => {
    it('should convert data into numbers', () => {
      expect(
        validateAddVasItemToItemPayload({
          itemId: '1',
          vasItemId: '1',
          vasCategoryId: '1',
          vasSellerId: '1',
          price: '1',
          quantity: '1',
        }),
      ).toMatchObject({
        itemId: 1,
        vasItemId: 1,
        vasCategoryId: 1,
        vasSellerId: 1,
        price: 1,
        quantity: 1,
      });
    });
    it('should throw validateAddVasItemToItemPayload', () => {
      expect(() =>
        validateAddVasItemToItemPayload({
          itemId: 'A',
          vasItemId: 1,
          vasCategoryId: 1,
          vasSellerId: 1,
          price: 1,
          quantity: 1,
        }),
      ).toThrow(ErrorMessages.INVALID_PAYLOAD);
      expect(() =>
        validateAddVasItemToItemPayload({
          itemId: 1,
          categoryId: 1,
          sellerId: 1,
          price: 1,
          // no quantity
        }),
      ).toThrow(ErrorMessages.INVALID_PAYLOAD);
    });
  });
  it('should throw with emtpy object', () => {
    expect(() => validateAddItemPayload({})).toThrow(ErrorMessages.INVALID_PAYLOAD);
    expect(() => validateAddVasItemToItemPayload({})).toThrow(ErrorMessages.INVALID_PAYLOAD);
    expect(() => validateRemoveItem({})).toThrow(ErrorMessages.INVALID_PAYLOAD);
  });
  describe('validateRemoveItem', () => {
    it('should convert data into numbers', () => {
      expect(
        validateRemoveItem({
          itemId: '111',
        }),
      ).toMatchObject({
        itemId: 111,
      });
      expect(() =>
        validateRemoveItem({
          itemId: '11A1',
        }),
      ).toThrow(ErrorMessages.INVALID_PAYLOAD);
    });
  });
});
