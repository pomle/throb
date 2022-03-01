import { debounce } from "../debounce";

describe("#debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("prevents immediate call", async () => {
    const spy = jest.fn();

    const call = debounce(spy, 300);

    call();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("calls function after given time", async () => {
    const spy = jest.fn();

    const call = debounce(spy, 300);

    call();

    expect(spy).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(299);

    expect(spy).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls function with same args", async () => {
    const spy = jest.fn();

    const call = debounce(spy, 300);

    const ref = Symbol("fake ref");
    call(1, "a", false, ref);

    jest.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalledWith(1, "a", false, ref);
  });

  it("pushes call indefinitely while function is called", async () => {
    const spy = jest.fn();

    const call = debounce(spy, 300);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    jest.advanceTimersByTime(299);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
