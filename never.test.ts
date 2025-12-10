import { assertEquals } from "@std/assert";
import { never } from "./never.ts";
import { Observer } from "../observer/observer.ts";
import type { ObserverNotification } from "./materialize.ts";
import { materialize } from "./materialize.ts";
import { pipe } from "@xan/pipe";

Deno.test(
  "never should not emit when subscribed to with an aborted signal",
  () => {
    // Arrange
    const controller = new AbortController();
    controller.abort();
    const notifications: Array<ObserverNotification> = [];
    const materialized = pipe(never, materialize());

    // Act
    materialized.subscribe(
      new Observer((notification) => notifications.push(notification)),
    );

    // Assert
    assertEquals(notifications, []);
  },
);

Deno.test(
  "never should not emit when subscribed to with a non-aborted signal",
  () => {
    // Arrange
    const controller = new AbortController();
    const notifications: Array<ObserverNotification> = [];
    const materialized = pipe(never, materialize());

    // Act
    materialized.subscribe(
      new Observer({
        signal: controller.signal,
        next: (notification) => notifications.push(notification),
      }),
    );

    // Assert
    assertEquals(notifications, []);
  },
);
