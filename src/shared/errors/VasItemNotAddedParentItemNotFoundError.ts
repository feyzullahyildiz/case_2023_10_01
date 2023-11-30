import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class VasItemNotAddedParentItemNotFoundError extends BaseError {
  constructor() {
    super(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_NOT_FOUND);
  }
}
