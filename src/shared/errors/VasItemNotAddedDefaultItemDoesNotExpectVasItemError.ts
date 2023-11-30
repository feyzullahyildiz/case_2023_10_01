import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class VasItemNotAddedDefaultItemDoesNotExpectVasItemError extends BaseError {
  constructor() {
    super(ErrorMessages.VAS_ITEM_NOT_ADDED_PARENT_DEFAULT_ITEM_DOES_NOT_EXPECT_VAS_ITEM);
  }
}
