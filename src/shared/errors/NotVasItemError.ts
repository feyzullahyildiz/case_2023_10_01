import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class NotVasItemError extends BaseError {
  constructor() {
    super(ErrorMessages.NOT_VAS_ITEM);
  }
}
