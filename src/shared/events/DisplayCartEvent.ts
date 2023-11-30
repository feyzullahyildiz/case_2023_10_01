import { BaseEvent } from '../base/BaseEvent';
import { IDisplayCartPayload } from '../payload';

export class DisplayCartEvent extends BaseEvent<IDisplayCartPayload> {
  constructor() {
    super('DisplayCartEvent', null);
  }
}
