import type { ObserverNotification } from "./materialize.ts";
import { pipe } from "@xan/pipe";
import { dematerialize } from "./dematerialize.ts";
import { Observer } from "@xan/observer";
import { materialize } from "./materialize.ts";
import { assertEquals } from "@std/assert";
import { Observable } from "@xan/observable";

Deno.test(
  "dematerialize should convert a source Observable of ObserverNotification objects into a source Observable of the original values",
  () => {
    // Arrange
    const source = new Observable<ObserverNotification<number>>((observer) => {
      for (const value of [1, 2, 3]) {
        observer.next(["N", value]);
        if (observer.signal.aborted) return;
      }
      observer.return();
    });
    const notifications: Array<ObserverNotification<number>> = [];
    const materialized = pipe(source, dematerialize(), materialize());

    // Act
    materialized.subscribe(
      new Observer((notification) => notifications.push(notification)),
    );

    // Assert
    assertEquals(notifications, [["N", 1], ["N", 2], ["N", 3], ["R"]]);
  },
);

Deno.test("dematerialize should honor unsubscribe", () => {
  // Arrange
  const controller = new AbortController();
  const source = new Observable<ObserverNotification<number>>((observer) => {
    for (const value of [1, 2, 3]) {
      observer.next(["N", value]);
      if (observer.signal.aborted) return;
    }
    observer.next(["R"]);
    observer.return();
  });

  const notifications: Array<ObserverNotification<number>> = [];
  const materialized = pipe(source, dematerialize(), materialize());

  // Act
  materialized.subscribe(
    new Observer({
      signal: controller.signal,
      next: (notification) => {
        notifications.push(notification);
        if (notifications.length === 2) controller.abort();
      },
    }),
  );

  // Assert
  assertEquals(notifications, [
    ["N", 1],
    ["N", 2],
  ]);
});
