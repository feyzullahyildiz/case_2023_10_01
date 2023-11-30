import { ItemEntity, ItemEntityType } from './ItemEntity';

export class DigitalItemEntity extends ItemEntity {
  getType() {
    return ItemEntityType.DIGITAL;
  }
}
