import { BaseEvent } from '../base/BaseEvent';

export class CalculatePromotionEvent extends BaseEvent<string> {
  constructor(public payload: string) {
    super('CalculatePromotionEvent', payload);
  }
}
