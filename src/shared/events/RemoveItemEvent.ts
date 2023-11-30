import { BaseEvent } from '../base/BaseEvent';
import { IRemoveItemPayload } from '../payload';

export class RemoveItemEvent extends BaseEvent<IRemoveItemPayload> {
  constructor(public payload: IRemoveItemPayload) {
    super('RemoveItemEvent', payload);
  }
}
