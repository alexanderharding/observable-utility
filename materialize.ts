import { from, isObservable, Observable } from "@xan/observable";

/**
 * Represents the [`next`](https://jsr.io/@xan/observer/doc/~/Observer.next) notification.
 */
export type Next<Value = unknown> = Readonly<["N", Value]>;

/**
 * Represents the [`return`](https://jsr.io/@xan/observer/doc/~/Observer.return) notification.
 */
export type Return = Readonly<["R"]>;

/**
 * Represents the [`throw`](https://jsr.io/@xan/observer/doc/~/Observer.throw) notification.
 */
export type Throw = Readonly<["T", unknown]>;

/**
 * Represents any type of [`Observer`](https://jsr.io/@xan/observer/doc/~/Observer) notification
 * ({@linkcode Next|next}, {@linkcode Return|return}, or {@linkcode Throw|throw}).
 */
export type ObserverNotification<Value = unknown> =
  | Next<Value>
  | Return
  | Throw;

/**
 * Represents all of the {@linkcode ObserverNotification|notifications} from the `source` [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) as
 * [`next`](https://jsr.io/@xan/observer/doc/~/Observer.next) emissions marked with their original types within
 * {@linkcode ObserverNotification|notification} entries.
 * @example <caption>An Observable that emits values and then returns</caption>
 * ```ts
 * import { materialize, of } from "@xan/observable-utility";
 * import { pipe } from "@xan/pipe";
 *
 * const controller = new AbortController();
 * pipe(of(1, 2, 3), materialize()).subscribe({
 *  signal: controller.signal,
 *  next: (value) => console.log(value),
 *  return: () => console.log("return"),
 *  throw: (value) => console.log("throw", value),
 * });
 *
 * // Console output:
 * // ["N", 1]
 * // ["N", 2]
 * // ["N", 3]
 * // ["R"]
 * // 'return'
 * ```
 * @example <caption>An Observable that throws</caption>
 * ```ts
 * import { thrown, of, materialize } from "@xan/observable-utility";
 * import { pipe } from "@xan/pipe";
 *
 * const controller = new AbortController();
 * pipe(thrown(new Error("error")), materialize()).subscribe({
 *  signal: controller.signal,
 *  next: (value) => console.log("next", value),
 *  return: () => console.log("return"),
 *  throw: (value) => console.log("throw", value),
 * });
 *
 * // Console output:
 * // ["T", new Error("error")]
 * // 'return'
 * ```
 */
export function materialize<Value>(): (
  source: Observable<Value>,
) => Observable<ObserverNotification<Value>> {
  return function materializeFn(source) {
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObservable(source)) {
      throw new TypeError("Parameter 1 is not of type 'Observable'");
    }
    source = from(source);
    return new Observable((observer) =>
      source.subscribe({
        signal: observer.signal,
        next: (value) => observer.next(["N", value]),
        return() {
          observer.next(["R"]);
          observer.return();
        },
        throw(value) {
          observer.next(["T", value]);
          observer.return();
        },
      })
    );
  };
}
