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
  it("rejects a resolved promise that is outdated", async () => {
    const handle1 = createAsyncHandle("bar");
    const handle2 = createAsyncHandle("foo");

    let index = 0;
    const handles = [handle1, handle2];

    function makeCall() {
      return handles[index++].promise;
    }

    const deraced = derace(makeCall);

    const promise1 = deraced();
    const promise2 = deraced();

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

    function makeCall() {
      return handles[index++].promise;
    }

    const deraced = derace(makeCall);

    const promise1 = deraced();
    handle1.complete();
    await expect(promise1).resolves.toEqual(1);

    const promise2 = deraced();
    handle2.complete();
    await expect(promise2).resolves.toEqual(2);

    const promise3 = deraced();
    handle3.complete();
    await expect(promise3).resolves.toEqual(3);
  });
});
