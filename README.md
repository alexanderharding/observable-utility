# @xan/observable-utility

A collection of common [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) utilities
with the intent to be used directly, and shared amongst other libraries that extend
[`Observables`](https://jsr.io/@xan/observable/doc/~/Observable)

## Build

Automated by [JSR](https://jsr.io/).

## Publishing

Automated by `.github\workflows\publish.yml`.

## Running unit tests

Run `deno task test` or `deno task test:ci` to execute the unit tests via
[Deno](https://deno.land/).

## Examples

```ts
import { of } from "@xan/observable-utility";

const controller = new AbortController();

of(1, 2, 3).subscribe({
  signal: controller.signal,
  next: (value) => console.log(value),
  return: () => console.log("return"),
  throw: (value) => console.log("throw", value),
});

// console output:
// 1
// 2
// 3
// return
```

```ts
import { of } from "@xan/observable-utility";
import { pipe } from "@xan/pipe";

const subscriptionController = new AbortController();
const tapController = new AbortController();

pipe(
  of(1, 2, 3),
  tap({
    signal: tapController.signal,
    next(value) {
      if (value === 2) controller.abort();
      console.log("tap next", value);
    },
    return: () => console.log("tap return"),
    throw: (value) => console.log("tap throw", value),
  }),
).subscribe({
  signal: subscriptionController.signal,
  next: (value) => console.log(value),
  return: () => console.log("return"),
  throw: (value) => console.log("throw", value),
});

// console output:
// tap next 1
// 1
// tap next 2
// 2
// 3
// "return"
```

# Glossary And Semantics

- [@xan/observer](https://jsr.io/@xan/observer#glossary-and-semantics)
- [@xan/observable](https://jsr.io/@xan/observable#glossary-and-semantics)
