import { container } from '../../infra/container';
import { BaseEvent } from './BaseEvent';
import type { CustomEventEmitter } from './CustomEventEmitter';

export abstract class BaseEventHandler<K, R = void> {
  constructor(baseEvent: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _onTry = this.onTry.bind(this) as typeof this.onTry;
    const _onCommit = this.onCommit.bind(this) as typeof this.onCommit;
    const emitter = container.resolve<CustomEventEmitter>('eventEmitter');
    emitter.on('TRY_' + baseEvent, _onTry);
    emitter.on('COMMIT_' + baseEvent, _onCommit);
  }
  abstract onTry(event: K, actualEvents: BaseEvent[]): void | never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract onCommit(uuid: string, event: K, aggregateRoot: any): R;
}
