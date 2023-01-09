import { List } from "./List.js";

test("List", () => {
  const list = new List();
  for (let j = 0; j < 1000; j++) list.push(j);
  expect(list.get(30)).toBe(30);
  expect(list.get(0)).toBe(0);
  expect(() => list.get(0.5)).toThrow();
  expect(list.get(-1)).toBe(999);
  expect(() => list.get(1000)).toThrow;
});

// as queue 3:2
test("List as queue", () => {
  const start = performance.now();
  const list = new List();
  for (let j = 0; j < 6e4; j++) list.push(j);
  for (let j = 0; j < 4e4; j++) list.shift();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list.values()].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => 40_000 + i)
      .join(",")
  );
});

// as stack 3:2
test("List as stack", () => {
  const start = performance.now();
  const list = new List();
  for (let j = 0; j < 6e4; j++) list.push(j);
  for (let j = 0; j < 4e4; j++) list.pop();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list.values()].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => i)
      .join(",")
  );
});

// as reverse stack 3:2
test("List as reverse stack", () => {
  const start = performance.now();
  const list = new List();
  for (let j = 0; j < 6e4; j++) list.unshift(j);
  for (let j = 0; j < 4e4; j++) list.shift();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list.values()].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => 19_999 - i)
      .join(",")
  );
});

// as queue stack (grow from both sides, shrink from both sides) 1:2:1
test("List as queue stack", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 2e5; j++) {
    list.push(j);
    list.unshift(j);
  }
  for (let j = 0; j < 1e5; j++) {
    list.shift();
    list.pop();
  }
  for (let j = 0; j < 1e5; j += 5) {
    list.get(j);
  }
  expect(performance.now() - start).toBeLessThan(2000);
  expect([...list.values()].join(",")).toEqual(
    new Array(100_000)
      .fill(0)
      .map((_, i) => 99_999 - i)
      .join(",") +
      "," +
      new Array(100_000)
        .fill(0)
        .map((_, i) => i)
        .join(",")
  );
});

test("List all", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  list.push(1, 10, 5);
  expect(list.length).toBe(3);
  expect([...list.values()]).toMatchObject([1, 10, 5]);
  expect(list.shift()).toBe(1);
  expect([...list.values()]).toMatchObject([10, 5]);
  expect(list.length).toBe(2);
  expect(list.get(0)).toBe(10);
  expect(list.get(1)).toBe(5);
  expect(() => list.get(2)).toThrow();
  expect(list.shift()).toBe(10);
  expect([...list.values()]).toMatchObject([5]);
  expect(list.push(11)).toBe(undefined);
  expect(list.push(9)).toBe(undefined);
  expect(list.remove(1)).toBe(11);
  expect(list.remove(1)).toBe(9);
  expect(() => list.remove(1)).toThrow();
  expect(list.remove(0)).toBe(5);
  expect(() => list.remove(0)).toThrow();
  expect([...list.values()]).toMatchObject([]);
  expect(list.length).toBe(0);
  expect([...list.values()]).toMatchObject([]);
  list.push(5, 10, 1);
  expect([...list.values()]).toMatchObject([5, 10, 1]);
  list.set(2, 2);
  expect(list.get(2)).toBe(2);
  expect([...list.values()]).toMatchObject([5, 10, 2]);
  expect(list.length).toBe(3);
  expect(list.pop()).toBe(2);
  expect(list.length).toBe(2);
  expect(list.shift()).toBe(5);
  expect(list.length).toBe(1);
  expect(list.shift()).toBe(10);
  list.push(10);
  list.set(-1, 4);
  expect(list.get(-1)).toBe(4);
  expect(list.pop()).toBe(4);
  expect(list.length).toBe(0);
  expect(list.pop()).toBe(undefined);
  expect(list.shift()).toBe(undefined);
  expect(list.length).toBe(0);
  expect([...list.values()]).toMatchObject([]);
});

test("List insert", () => {
  const list = new List<string>();
  expect(list.length).toBe(0);
  list.insert(0, "foo");
  list.insert(0, "bar");
  list.insert(1, "baz");
  expect(() => list.insert(4, "boo")).toThrow();
  expect([...list.values()]).toMatchObject(["bar", "baz", "foo"]);
});

test("List offset overflow", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  list.push(...new Array(20).fill(0).map((_, i) => i));
  for (let i = 0; i <= 15; i++) list.shift();
  expect([...list.values()]).toMatchObject([16, 17, 18, 19]);
});
