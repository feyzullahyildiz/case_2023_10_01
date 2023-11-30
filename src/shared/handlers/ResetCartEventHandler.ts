import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { ResetCartEvent } from '../events';

export class ResetCartEventHandler extends BaseEventHandler<ResetCartEvent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: any) {
    super('ResetCartEvent');
  }
  onTry() {}
  onCommit(uuid: string) {
    const cartRepository = this.context.cartRepository as CartRepository;
    return cartRepository.resetCart(uuid);
  }
}
