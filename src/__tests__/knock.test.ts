import { knock } from "../knock";

describe("#knock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("ignores calls until threshold met", () => {
    const spy = jest.fn();

    const call = knock(spy, 5, 1000);
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    call();
    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(0);

    call();
    expect(spy).toHaveBeenCalledTimes(1);

    call();
    expect(spy).toHaveBeenCalledTimes(2);
    call();
    call();
    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(7);
    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(10);
  });

  it("resets counter remember interval", () => {
    const spy = jest.fn();

    const call = knock(spy, 2, 1000);

    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);

    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("reset limit can be pushed indefinitely", () => {
    const spy = jest.fn();

    const call = knock(spy, 2, 1000);

    call();
    call();
    call();
    expect(spy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(999);
    call();
    expect(spy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(999);
    call();
    expect(spy).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(999);
    call();
    expect(spy).toHaveBeenCalledTimes(4);

    jest.advanceTimersByTime(999);
    call();
    expect(spy).toHaveBeenCalledTimes(5);
  });
});
