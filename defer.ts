import { from, isObservable, Observable } from "@xan/observable";

/**
 * Creates an [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) that, on
 * [`subscribe`](https://jsr.io/@xan/observable/doc/~/Observable.subscribe), calls an
 * [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) {@linkcode factory} to
 * get an [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) for each
 * [`Observer`](https://jsr.io/@xan/observer/doc/~/Observer).
 */
export function defer<Value>(
  factory: () => Observable<Value>,
): Observable<Value> {
  if (arguments.length === 0) {
    throw new TypeError("1 argument required but 0 present");
  }
  if (typeof factory !== "function") {
    throw new TypeError("Parameter 1 is not of type 'Function'");
  }
  return new Observable((observer) => {
    const observable = factory();
    if (isObservable(observable)) from(observable).subscribe(observer);
    else throw new TypeError("'factory' must return of type 'Observable'");
  });
}
