import { Observer } from "@xan/observer";
import { of } from "./mod.ts";
import { assertEquals } from "@std/assert";

Deno.test("of should return empty if no values are provided", () => {
  // Arrange
  const observable = of();
  const notifications: Array<["N", never] | ["R"] | ["T", unknown]> = [];

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (error) => notifications.push(["T", error]),
    }),
  );

  // Assert
  assertEquals(notifications, [["R"]]);
});

Deno.test("of should emit all values in order and then return", () => {
  // Arrange
  const notifications: Array<["N", unknown] | ["R"] | ["T", unknown]> = [];
  const observable = of(1, "test", true);

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (error) => notifications.push(["T", error]),
    }),
  );

  // Assert
  assertEquals(notifications, [["N", 1], ["N", "test"], ["N", true], ["R"]]);
});
