import { BaseError } from './BaseError';
import { ErrorMessages } from '../message';

export class InvalidPayloadError extends BaseError {
  constructor() {
    super(ErrorMessages.INVALID_PAYLOAD);
  }
}
