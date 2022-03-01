import { derace } from "../derace";

function createAsyncHandle<T>(value: T) {
  let resolveNow: (value: T) => void;

  const promise = new Promise<T>((resolve) => {
    resolveNow = resolve;
  });

  return {
    promise,
    complete() {
      resolveNow(value);
    },
  };
}

describe("#derace", () => {
  it("calls function with same args", () => {
    const spy = jest.fn((a: number, b: string) => {
      return Promise.resolve([a, b].join(","));
    });

    const call = derace(spy);
    call(1, "foo");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(1, "foo");
  });

  it("maintains type of return value", () => {
    const spy = jest.fn(() => {
      return Promise.resolve("my string");
    });

    const call = derace(spy);

    expect(call().then((text) => text.length)).resolves.toEqual(9);
  });

  it("rejects a resolved promise that is outdated", async () => {
    const handle1 = createAsyncHandle("bar");
    const handle2 = createAsyncHandle("foo");

    let index = 0;
    const handles = [handle1, handle2];

    const spy = jest.fn(() => {
      return handles[index++].promise;
    });

    const call = derace(spy);

    const promise1 = call();
    const promise2 = call();

    handle1.complete();
    handle2.complete();

    await Promise.all([
      expect(promise1).rejects.toEqual(new Error("Outdated result")),
      expect(promise2).resolves.toEqual("foo"),
    ]);
  });

  it("resolves all promises resolving in order", async () => {
    const handle1 = createAsyncHandle(1);
    const handle2 = createAsyncHandle(2);
    const handle3 = createAsyncHandle(3);

    let index = 0;
    const handles = [handle1, handle2, handle3];

    const spy = jest.fn(() => {
      return handles[index++].promise;
    });

    const call = derace(spy);

    const promise1 = call();
    handle1.complete();
    await expect(promise1).resolves.toEqual(1);

    const promise2 = call();
    handle2.complete();
    await expect(promise2).resolves.toEqual(2);

    const promise3 = call();
    handle3.complete();
    await expect(promise3).resolves.toEqual(3);
  });
});
