import { from, isObservable, Observable } from "@xan/observable";
import type { Observer } from "@xan/observer";

/**
 * The `producer` is notifying the `consumer` that it is done [`nexting`](https://jsr.io/@xan/observer/doc/~/Observer.next), values for any reason,
 * and will send no more values. Finalization, if it occurs, will always happen as a side-effect _after_
 * [`return`](https://jsr.io/@xan/observer/doc/~/Observer.return), [`throw`](https://jsr.io/@xan/observer/doc/~/Observer.throw),
 * or [`unsubscribe`](https://jsr.io/@xan/observer/doc/~/Observer.signal) (whichever comes last).
 */
export function finalize<Value>(
  finalizer: () => void,
): (source: Observable<Value>) => Observable<Value> {
  if (arguments.length === 0) {
    throw new TypeError("1 argument required but 0 present");
  }
  if (typeof finalizer !== "function") {
    throw new TypeError("Parameter 1 is not of type 'Function'");
  }
  return function finalizeFn(source) {
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObservable(source)) {
      throw new TypeError("Parameter 1 is not of type 'Observable'");
    }
    source = from(source);
    return new Observable((observer: Observer<Value>) => {
      const controller = new AbortController();
      observer.signal.addEventListener("abort", () => finalizer(), {
        once: true,
        signal: controller.signal,
      });
      source.subscribe({
        signal: observer.signal,
        next: (value) => observer.next(value),
        return() {
          controller.abort();
          observer.return();
          finalizer();
        },
        throw(value) {
          controller.abort();
          observer.throw(value);
          finalizer();
        },
      });
    });
  };
}
