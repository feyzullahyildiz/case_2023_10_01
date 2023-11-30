import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxAmountInCartExceededError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_AMOUNT_IN_CART_EXCEEDED);
  }
}
