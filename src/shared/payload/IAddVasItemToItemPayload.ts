import { IPayload } from '../base/IPayload';

export interface IAddVasItemToItemPayload extends IPayload {
  itemId: number;
  vasItemId: number;
  vasCategoryId: number;
  vasSellerId: number;
  price: number;
  quantity: number;
}
