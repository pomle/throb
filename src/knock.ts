export function knock<Args extends unknown[]>(
  func: (...args: Args) => void,
  threshold: number,
  remember: number,
) {
  let count = 0;
  let timer: number;

  return function knockableFunction(...args: Args) {
    window.clearTimeout(timer);

    count++;
    if (count <= threshold) {
      return;
    }

    timer = window.setTimeout(() => {
      count = 0;
    }, remember);

    return func(...args);
  };
}
