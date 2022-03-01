import { derace } from "../derace";

function createAsyncHandle() {
  let resolve: (value: unknown) => void;

  const promise = new Promise((r) => {
    resolve = r;
  });

  return {
    promise,
    complete(value: unknown) {
      resolve(value);
    },
  };
}

describe("#derace", () => {
  it("rejects a resolved promise that is outdated", async () => {
    const handle1 = createAsyncHandle();
    const handle2 = createAsyncHandle();

    let index = 0;
    const handles = [handle1, handle2];

    function makeCall() {
      return handles[index++].promise;
    }

    const deraced = derace(makeCall);

    const promise1 = deraced();
    const promise2 = deraced();

    handle1.complete("bar");
    handle2.complete("foo");

    await Promise.all([
      expect(promise1).rejects.toEqual(new Error("Outdated result")),
      expect(promise2).resolves.toEqual("foo"),
    ]);
  });

  it("resolves all promises resolving in order", async () => {
    const handle1 = createAsyncHandle();
    const handle2 = createAsyncHandle();
    const handle3 = createAsyncHandle();

    let index = 0;
    const handles = [handle1, handle2, handle3];

    function makeCall() {
      return handles[index++].promise;
    }

    const deraced = derace(makeCall);

    const promise1 = deraced();
    handle1.complete(1);
    await expect(promise1).resolves.toEqual(1);

    const promise2 = deraced();
    handle2.complete(2);
    await expect(promise2).resolves.toEqual(2);

    const promise3 = deraced();
    handle3.complete(3);
    await expect(promise3).resolves.toEqual(3);
  });
});
