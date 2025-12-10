import { pipe } from "@xan/pipe";
import { keepAlive } from "./keep-alive.ts";
import { materialize, type ObserverNotification } from "./materialize.ts";
import { Observer } from "@xan/observer";
import { of } from "./of.ts";
import { assertEquals, assertStrictEquals } from "@std/assert";
import { tap } from "./tap.ts";

Deno.test("keepAlive should ignore unsubscribe indefinitely", () => {
  // Arrange
  const controller = new AbortController();
  const tapNotifications: Array<ObserverNotification<number>> = [];
  const observerNotifications: Array<ObserverNotification<number>> = [];
  const source = of(1, 2, 3);

  // Act
  pipe(
    source,
    materialize(),
    tap(new Observer((notification) => tapNotifications.push(notification))),
    keepAlive(),
  ).subscribe(
    new Observer({
      signal: controller.signal,
      next: (notification) => {
        observerNotifications.push(notification);
        if (notification[1] === 2) controller.abort();
      },
    }),
  );

  // Assert
  assertStrictEquals(controller.signal.aborted, true);
  assertEquals(observerNotifications, [
    ["N", 1],
    ["N", 2],
  ]);
  assertEquals(tapNotifications, [["N", 1], ["N", 2], ["N", 3], ["R"]]);
});
