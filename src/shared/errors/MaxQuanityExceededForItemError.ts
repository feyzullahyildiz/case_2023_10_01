import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxQuanityExceededForItemError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_ALLOWED_QUANTITY_VALUE_EXCEEDED_FOR_ITEM);
  }
}
