import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { GetAllQuantityEvent } from '../events';

export class GetAllQuantityEventHandler extends BaseEventHandler<GetAllQuantityEvent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: any) {
    super('GetAllQuantityEvent');
  }
  onTry() {}
  onCommit(uuid: string) {
    const cartRepository = this.context.cartRepository as CartRepository;
    return cartRepository.getTotalQuantity(uuid);
  }
}
