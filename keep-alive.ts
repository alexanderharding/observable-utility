import { from, isObservable, Observable } from "@xan/observable";

const { signal: noopSignal } = new AbortController();

/**
 * Ignores [`unsubscribe`](https://jsr.io/@xan/observer/doc/~/Observer.signal) indefinitely.
 */
export function keepAlive<Value>(): (
  source: Observable<Value>,
) => Observable<Value> {
  return function keepAliveFn(source) {
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObservable(source)) {
      throw new TypeError("Parameter 1 is not of type 'Observable'");
    }
    source = from(source);
    return new Observable((observer) =>
      source.subscribe({
        signal: noopSignal,
        next: (value) => observer.next(value),
        return: () => observer.return(),
        throw: (value) => observer.throw(value),
      })
    );
  };
}
