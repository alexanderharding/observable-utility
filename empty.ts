import { Observable } from "@xan/observable";

/**
 * An [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) that calls [`return`](https://jsr.io/@xan/observer/doc/~/Observer.return)
 * immediately on [`subscribe`](https://jsr.io/@xan/observable/doc/~/Observable.subscribe).
 * @example
 * ```ts
 * import { empty } from '@xan/observable-utility';
 *
 * const controller = new AbortController();
 *
 * empty.subscribe({
 * 	signal: controller.signal,
 * 	next: () => console.log("next"), // Never called
 * 	throw: () => console.log("throw"), // Never called
 * 	return: () => console.log("return"), // Called immediately
 * });
 * ```
 */
export const empty: Observable<never> = new Observable((observer) => observer.return());
