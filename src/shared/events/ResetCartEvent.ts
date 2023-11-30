import { BaseEvent } from '../base/BaseEvent';
import { IResetCartPayload } from '../payload';

export class ResetCartEvent extends BaseEvent<IResetCartPayload> {
  constructor() {
    super('ResetCartEvent', null);
  }
}
