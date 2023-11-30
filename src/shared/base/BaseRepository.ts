import { BaseEntity } from './BaseEntity';

export abstract class BaseRepository<T extends BaseEntity> {
  private readonly map = new Map<string, T>();
  protected getById(id: string): T {
    return this.map.get(id);
  }
  protected add(id: string, item: T) {
    this.map.set(id, item);
  }
  protected delete(id: string) {
    this.map.delete(id);
  }
  protected clear() {
    this.map.clear();
  }
}
