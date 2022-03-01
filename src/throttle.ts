export function throttle<F extends (...args: unknown[]) => void>(
  fn: F,
  timeout: number,
) {
  let set: boolean = false;

  return function throttledFunction(...args: Parameters<F>) {
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
