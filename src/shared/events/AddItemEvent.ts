import { BaseEvent } from '../base/BaseEvent';
import { IAddItemPayload } from '../payload';

export class AddItemEvent extends BaseEvent<IAddItemPayload> {
  constructor(public payload: IAddItemPayload) {
    super('AddItemEvent', payload);
  }
}
