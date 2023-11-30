import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxIUniqueItemExceededError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_UNIQUE_TEM_COUNT_IN_CART_EXCEEDED);
  }
}
