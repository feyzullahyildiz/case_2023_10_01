import { BaseEvent } from '../base/BaseEvent';

export class CartCreatedEvent extends BaseEvent<null> {
  constructor() {
    super('CartCreatedEvent', null);
  }
}
