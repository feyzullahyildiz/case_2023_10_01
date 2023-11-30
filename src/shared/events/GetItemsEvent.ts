import { IAddItemPayload } from '../payload';
import { BaseEvent } from '../base/BaseEvent';

export class GetItemsEvent extends BaseEvent<IAddItemPayload[]> {
  constructor() {
    super('GetItemsEvent', null, 'readonly');
  }
}
