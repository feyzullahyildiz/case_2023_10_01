import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { GetItemsEvent } from '../events';

export class GetAmountEventHandler extends BaseEventHandler<GetItemsEvent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: any) {
    super('GetAmountEvent');
  }
  onTry() {}
  onCommit(uuid: string) {
    const cartRepository = this.context.cartRepository as CartRepository;
    return cartRepository.getAmount(uuid);
  }
}
