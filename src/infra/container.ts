import { asClass, createContainer, InjectionMode } from 'awilix';
import { CartRepository } from '../domain/cart/CartRepository';
import {
  // Event Emitter
  CustomEventEmitter,

  // EventHandlers
  AddItemEventHandler,
  AddSubItemEventHandler,
  CartCreatedEventHandler,
  GetItemsEventHandler,
  GetAllQuantityEventHandler,
  GetAmountEventHandler,
  RemoveItemEventHandler,
  ResetCartEventHandler,
  DisplayCartEventHandler,
  CalculatePromotionEventHandler,
} from '../shared';

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
}).register({
  eventEmitter: asClass(CustomEventEmitter).singleton(),
  // Repositories
  cartRepository: asClass(CartRepository).singleton(),

  // EventHandlers
  addItemEventHandler: asClass(AddItemEventHandler).singleton(),
  addSubItemEventHandler: asClass(AddSubItemEventHandler).singleton(),
  getItemsEventHandler: asClass(GetItemsEventHandler).singleton(),
  cartCreatedEventHandler: asClass(CartCreatedEventHandler).singleton(),
  getQuantityEventHandler: asClass(GetAllQuantityEventHandler).singleton(),
  getAmountEventHandler: asClass(GetAmountEventHandler).singleton(),
  removeItemEventHandler: asClass(RemoveItemEventHandler).singleton(),
  resetCartEventHandler: asClass(ResetCartEventHandler).singleton(),
  displayCartEventHandler: asClass(DisplayCartEventHandler).singleton(),
  calculatePromotionEventHandler: asClass(CalculatePromotionEventHandler).singleton(),
});
container.resolve('eventEmitter');

container.resolve('addItemEventHandler');
container.resolve('addSubItemEventHandler');
container.resolve('getItemsEventHandler');
container.resolve('cartCreatedEventHandler');
container.resolve('getQuantityEventHandler');
container.resolve('getAmountEventHandler');
container.resolve('removeItemEventHandler');
container.resolve('resetCartEventHandler');
container.resolve('displayCartEventHandler');
container.resolve('calculatePromotionEventHandler');
