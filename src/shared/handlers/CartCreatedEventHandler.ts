import { CartRepository } from '../../domain/cart/CartRepository';
import { BaseEventHandler } from '../base/BaseEventHandler';

export class CartCreatedEventHandler extends BaseEventHandler<null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public context: any) {
    super('CartCreatedEvent');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTry() {}

  onCommit(uuid: string): void {
    const cartRepository = this.context.cartRepository as CartRepository;
    cartRepository.initEntity(uuid);
  }
}
