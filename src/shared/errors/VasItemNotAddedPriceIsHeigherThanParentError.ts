import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class VasItemNotAddedPriceIsHeigherThanParentError extends BaseError {
  constructor() {
    super(ErrorMessages.VAS_ITEM_NOT_ADDED_PRICE_IS_HEIGHER_THAN_PARENT);
  }
}
