import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxVasQuanityExceededInDefaultItemError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_DEFAULT_ITEM);
  }
}
