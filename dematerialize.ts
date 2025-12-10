import { from, isObservable, Observable } from "@xan/observable";
import type { ObserverNotification } from "./materialize.ts";

/**
 * Converts an [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) of
 * {@linkcode ObserverNotification|notification} objects into the emissions that they represent.
 */
export function dematerialize<Value>(): (
  source: Observable<ObserverNotification<Value>>,
) => Observable<Value> {
  return function dematerializeFn(source) {
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
        next(value) {
          switch (value[0]) {
            case "N":
              return observer.next(value[1]);
            case "R":
              return observer.return();
            case "T":
              return observer.throw(value[1]);
            default:
              throw new TypeError(
                "Parameter 1 is not of type 'ObserverNotification'",
              );
          }
        },
        return: () => observer.return(),
        throw: (value) => observer.throw(value),
      })
    );
  };
}
