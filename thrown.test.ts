import { Observer } from "@xan/observer";
import { thrown } from "./thrown.ts";
import { assertEquals } from "@std/assert";
import type { ObserverNotification } from "./materialize.ts";
import { pipe } from "@xan/pipe";
import { materialize } from "./materialize.ts";

Deno.test(
  "thrown should push an error to the observer immediately upon subscription",
  () => {
    // Arrange
    const error = new Error(Math.random().toString());
    const notifications: Array<ObserverNotification<unknown>> = [];
    const observable = pipe(thrown(error), materialize());

    // Act
    observable.subscribe(
      new Observer((notification) => notifications.push(notification)),
    );

    // Assert
    assertEquals(notifications, [["T", error]]);
  },
);
