import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class MaxDigitalItemExceededError extends BaseError {
  constructor() {
    super(ErrorMessages.MAX_DIGITAL_ITEM_EXCEEDED);
  }
}
