import { BaseEvent } from '../base/BaseEvent';

export class GetAllQuantityEvent extends BaseEvent<number> {
  constructor() {
    super('GetAllQuantityEvent', null, 'readonly');
  }
}
