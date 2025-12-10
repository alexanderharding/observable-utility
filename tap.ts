import { from as observableFrom, isObservable, Observable } from "@xan/observable";
import { from as observerFrom, isObserver, type Observer } from "@xan/observer";

/**
 * Used to perform side-effects on the `source` [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable).
 * ```ts
 * import { of } from "@xan/observable-utility";
 * import { pipe } from "@xan/pipe";
 *
 * const subscriptionController = new AbortController();
 * const tapController = new AbortController();
 *
 * pipe(
 *   of(1, 2, 3),
 *   tap({
 *     signal: tapController.signal,
 *     next(value) {
 *       if (value === 2) controller.abort();
 *       console.log("tap next", value);
 *     },
 *     return: () => console.log("tap return"),
 *     throw: (value) => console.log("tap throw", value),
 *   })
 * ).subscribe({
 *   signal: subscriptionController.signal,
 *   next: (value) => console.log(value),
 *   return: () => console.log("return"),
 *   throw: (value) => console.log("throw", value),
 * });
 *
 * // console output:
 * // tap next 1
 * // 1
 * // tap next 2
 * // 2
 * // 3
 * // "return"
 * ```
 */
export function tap<Value>(
  observer: Observer<Value>,
): (source: Observable<Value>) => Observable<Value> {
  if (arguments.length === 0) {
    throw new TypeError("1 argument required but 0 present");
  }
  if (!isObserver(observer)) {
    throw new TypeError("Parameter 1 is not of type 'Observer'");
  }
  const tapObserver = observerFrom(observer);
  return function tapFn(source) {
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObservable(source)) {
      throw new TypeError("Parameter 1 is not of type 'Observable'");
    }
    source = observableFrom(source);
    return new Observable((observer) =>
      source.subscribe({
        signal: observer.signal,
        next(value) {
          tapObserver.next(value);
          observer.next(value);
        },
        return() {
          tapObserver.return();
          observer.return();
        },
        throw(value) {
          tapObserver.throw(value);
          observer.throw(value);
        },
      })
    );
  };
}
