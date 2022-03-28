import { retry } from "../retry";

describe("#retry", () => {
  it("makes initial call immediately", async () => {
    const spy = jest.fn();
    const call = retry(spy, [1, 2, 3]);

    call();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls wrapped function with same args", async () => {
    const spy = jest.fn().mockRejectedValue("err");
    const call = retry(spy, [1, 2, 3]);

    const promise = call(1, "foo");

    await expect(promise)
      .rejects.toEqual(["err", "err", "err", "err"])
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).nthCalledWith(1, 1, "foo");
        expect(spy).nthCalledWith(2, 1, "foo");
        expect(spy).nthCalledWith(3, 1, "foo");
        expect(spy).nthCalledWith(4, 1, "foo");
      });
  });

  it("supports number array for backoff", async () => {
    const spy = jest.fn().mockRejectedValue("err");
    const call = retry(spy, [5, 5, 5]);

    const promise = call();

    await expect(promise)
      .rejects.toEqual(["err", "err", "err", "err"])
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(4);
      });
  });

  it("supports generator", async () => {
    const spy = jest.fn().mockRejectedValue("err");

    function* times() {
      for (let i = 0; i < 5; i++) {
        yield 1;
      }
    }

    const call = retry(spy, times());

    const promise = call();

    await expect(promise)
      .rejects.toEqual(["err", "err", "err", "err", "err", "err"])
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(6);
      });
  });

  it("retries until resolve", async () => {
    const spy = jest
      .fn()
      .mockRejectedValueOnce("err")
      .mockResolvedValue("success");

    const call = retry(spy, [1, 1]);

    const promise = call();

    await expect(promise)
      .resolves.toEqual("success")
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(2);
      });
  });

  it("rejects with arrays of errors when retries exhausted", async () => {
    const spy = jest
      .fn()
      .mockRejectedValueOnce("err1")
      .mockRejectedValueOnce("err2")
      .mockRejectedValueOnce("err3")
      .mockRejectedValueOnce("err4");

    const call = retry(spy, [1, 1, 1]);

    const promise = call();

    await expect(promise)
      .rejects.toEqual(["err1", "err2", "err3", "err4"])
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(4);
      });
  });
});
