import { v4 as uuidv4 } from 'uuid';
import { BaseEvent } from './BaseEvent';

export type AggregateRootConstructorParam = null | string | Array<BaseEvent>;
export abstract class AggregateRoot {
  uuid: string;
  public constructor(param: AggregateRootConstructorParam = null) {
    this.events = [];

    if (param === null) {
      this.uuid = uuidv4();
    } else if (typeof param === 'string') {
      this.uuid = param;
    } else {
      this.uuid = uuidv4();
      for (const event of param) {
        this.commitEvent(event);
      }
    }
  }
  private events: BaseEvent[] = [];

  // protected tryEvent<T>(event: BaseEvent<T>): T {
  //   return event.try(this.uuid, this.getChanges()) as T;
  // }
  protected tryEvent(event: BaseEvent): boolean {
    return event.try(this.getChanges());
  }
  protected commitEvent<P, T extends BaseEvent<P>>(event: T) {
    const res = event.commit(this.uuid, this);
    if (event.type === 'crud') {
      this.events.push(event);
    }
    return res;
  }
  public getChanges() {
    return [...this.events];
  }
}
