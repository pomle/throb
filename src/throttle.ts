export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  timeout: number,
) {
  let set: boolean = false;

  return function throttledFunction(...args: Args) {
    if (set) {
      return;
    }

    window.setTimeout(() => {
      set = false;
      fn(...args);
    }, timeout);

    set = true;
  };
}
