import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class UnexpectedItemItLooksLikeVasItemError extends BaseError {
  constructor() {
    super(ErrorMessages.UNEXPECTED_ITEM_FOUND_IT_LOOKS_LIKE_VAS);
  }
}
