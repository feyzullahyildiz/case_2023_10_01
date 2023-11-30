import { IPayload } from '../base/IPayload';

export interface IAddItemPayload extends IPayload {
  itemId: number;
  categoryId: number;
  sellerId: number;
  price: number;
  quantity: number;
}
