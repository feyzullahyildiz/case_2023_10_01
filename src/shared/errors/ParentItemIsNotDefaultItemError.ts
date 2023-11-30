import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class ParentItemIsNotDefaultItemError extends BaseError {
  constructor() {
    super(ErrorMessages.PARENT_ITEM_NOT_DEFAULT_ITEM);
  }
}
