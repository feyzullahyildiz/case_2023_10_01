import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { GetItemsEvent } from '../events';

export class GetItemsEventHandler extends BaseEventHandler<GetItemsEvent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: any) {
    super('GetItemsEvent');
  }
  onTry() {}
  onCommit(uuid: string) {
    const cartRepository = this.context.cartRepository as CartRepository;
    return cartRepository.getItems(uuid);
  }
}
