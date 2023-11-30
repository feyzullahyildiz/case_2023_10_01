export class CustomEventEmitter {
  private readonly map = new Map();
  on<T, K, L>(action: string, cb: (p1: T, p2: K, p3: L) => void) {
    if (this.map.has(action)) {
      throw new Error(`callback function is already defined for: ${action}`);
    }
    this.map.set(action, cb);
  }
  emit<T, K, L>(action: string, p1: T, p2: K, p3?: L) {
    const cb = this.map.get(action);
    if (!cb) {
      throw new Error(`callback function is not defined for: ${action}`);
    }
    return cb(p1, p2, p3);
  }
}
