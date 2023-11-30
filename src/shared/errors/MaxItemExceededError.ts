import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxItemExceededError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_ALLOWED_QUANTITY_IN_CART_EXCEEDED);
  }
}
