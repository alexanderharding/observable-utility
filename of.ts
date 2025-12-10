import { Observable } from "@xan/observable";

/**
 * Creates and returns an [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) that emits a sequence of {@linkcode values} in order on
 * [`subscribe`](https://jsr.io/@xan/observable/doc/~/Observable.subscribe) and then [`returns`](https://jsr.io/@xan/observer/doc/~/Observer.return).
 * @example
 * ```ts
 * import { of } from '@xan/observable-utility';
 *
 * const controller = new AbortController();
 *
 * of(1, 2, 3).subscribe({
 *   signal: controller.signal,
 *   next: (value) => console.log(value),
 *   return: () => console.log('return'),
 *   throw: (value) => console.error('throw', value),
 * });
 *
 * // console output:
 * // 1
 * // 2
 * // 3
 * // return
 * ```
 * @example
 * ```ts
 * import { of } from '@xan/observable-utility';
 *
 * let count = 0;
 * const controller = new AbortController();
 *
 * of(1, 2, 3).subscribe({
 *   signal: controller.signal,
 *   next(value) {
 *     if (value === 2) controller.abort();
 *     console.log(value);
 *   },
 *   return: () => console.log('return'),
 *   throw: (value) => console.error('throw', value),
 * });
 *
 * // console output:
 * // 1
 * // 2
 * ```
 */
export function of<const Values extends ReadonlyArray<unknown>>(
  ...values: Values
): Observable<Values[number]> {
  return new Observable((observer) => {
    for (const value of values) {
      observer.next(value);
      if (observer.signal.aborted) return;
    }
    observer.return();
  });
}
