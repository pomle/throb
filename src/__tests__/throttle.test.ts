import { throttle } from "../throttle";

describe("#throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("prevents immediate call", async () => {
    const spy = jest.fn();

    const call = throttle(spy, 300);

    call();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("calls function after given time", async () => {
    const spy = jest.fn();

    const call = throttle(spy, 300);

    call();

    expect(spy).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(299);

    expect(spy).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls function with same args", async () => {
    const spy = jest.fn();

    const call = throttle(spy, 300);

    const ref = Symbol("fake ref");
    call(1, "a", false, ref);

    jest.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalledWith(1, "a", false, ref);
  });

  it("calls function regardless if function is called again when timeout expired", async () => {
    const spy = jest.fn();

    const call = throttle(spy, 300);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(1);

    call();
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(2);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(2);

    call();
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
