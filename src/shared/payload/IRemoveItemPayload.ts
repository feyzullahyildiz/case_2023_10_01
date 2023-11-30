import { IPayload } from '../base/IPayload';

export interface IRemoveItemPayload extends IPayload {
  itemId: number;
}
