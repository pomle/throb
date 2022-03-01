import { turnstyle } from "../turnstyle";

describe("#turnstyle", () => {
  it("resolves wrapped value", async () => {
    const spy = jest.fn().mockResolvedValue("foo");

    const call = turnstyle(spy);

    await expect(call()).resolves.toEqual("foo");
  });

  it("returns null while promise in flight", async () => {
    const spy = jest.fn().mockResolvedValue("foo");

    const call = turnstyle(spy);

    const promise1 = call();
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    await expect(promise1).resolves.toEqual("foo");
    const promise2 = call();
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    expect(call()).toBe(null);
    await expect(promise2).resolves.toEqual("foo");
  });

  it("allows catching internal error", async () => {
    const spy = jest.fn().mockRejectedValue("err");

    const call = turnstyle(spy);

    await expect(call()).rejects.toEqual("err");
  });
});
