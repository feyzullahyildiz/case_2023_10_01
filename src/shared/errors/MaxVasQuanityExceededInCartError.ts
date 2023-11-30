import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxVasQuanityExceededInCartError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_ALLOWED_VAS_QUANTITY_EXCEEDED_IN_CART);
  }
}
