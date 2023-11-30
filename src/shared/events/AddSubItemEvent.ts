import { BaseEvent } from '../base/BaseEvent';
import { IAddVasItemToItemPayload } from '../payload';

export class AddSubItemEvent extends BaseEvent<IAddVasItemToItemPayload> {
  constructor(public payload: IAddVasItemToItemPayload) {
    super('AddSubItemEvent', payload);
  }
}
