import { container } from '../../infra/container';
import { AggregateRoot } from './AggregateRoot';
import type { CustomEventEmitter } from './CustomEventEmitter';
import type { IPayload } from './IPayload';

// These Events can be readonly
// So, We can check these events in Reposity while commiting.
// We dont push it into changes array If it is readonly event

type EventType = 'readonly' | 'crud';
export abstract class BaseEvent<T = IPayload> {
  // eslint-disable-next-line no-unused-vars
  constructor(
    private name: string,
    public payload: T,
    public readonly type: EventType = 'crud',
  ) {}
  public try(actualEvents: BaseEvent[]) {
    const emitter = container.resolve<CustomEventEmitter>('eventEmitter');
    return emitter.emit('TRY_' + this.name, this, actualEvents);
  }
  public commit(uuid: string, aggregateRoot: AggregateRoot) {
    const emitter = container.resolve<CustomEventEmitter>('eventEmitter');
    return emitter.emit<string, BaseEvent, AggregateRoot>('COMMIT_' + this.name, uuid, this, aggregateRoot);
  }
}
