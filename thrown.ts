import { Observable } from "@xan/observable";

/**
 * Creates an [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) that will [`throw`](https://jsr.io/@xan/observer/doc/~/Observer.throw) the
 * given `value` immediately upon [`subscribe`](https://jsr.io/@xan/observable/doc/~/Observable.subscribe).
 *
 * @param value The value to [`throw`](https://jsr.io/@xan/observer/doc/~/Observer.throw).
 * @example
 * ```ts
 * import { thrown } from "@xan/observable-utility";
 *
 * const controller = new AbortController();
 *
 * thrown(new Error("throw")).subscribe({
 *   signal: controller.signal,
 *   next: (value) => console.log(value), // Never called
 *   return: () => console.log("return"), // Never called
 *   throw: (value) => console.log(value), // Called immediately
 * });
 * ```
 */
export function thrown(value: unknown): Observable<never> {
  return new Observable((observer) => observer.throw(value));
}
