import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';
import { DisplayCartEvent } from '../events';

export class DisplayCartEventHandler extends BaseEventHandler<DisplayCartEvent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: any) {
    super('DisplayCartEvent');
  }
  onTry() {}
  onCommit(uuid: string) {
    const cartRepository = this.context.cartRepository as CartRepository;
    return cartRepository.getSerializable(uuid);
  }
}
