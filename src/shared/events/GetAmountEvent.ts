import { BaseEvent } from '../base/BaseEvent';
import { IPayload } from '../base/IPayload';

export class GetAmountEvent extends BaseEvent<IPayload> {
  constructor() {
    super('GetAmountEvent', null, 'readonly');
  }
}
