import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class ItemNotFoundToRemoveError extends BaseError {
  constructor() {
    super(ErrorMessages.ITEM_NOT_FOUND_TO_REMOVE);
  }
}
