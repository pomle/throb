export function debounce<F extends (...args: unknown[]) => void>(
  func: F,
  wait: number,
) {
  let timeout: number;

  return function debouncedFunction(...args: Parameters<F>) {
    const later = () => {
      window.clearTimeout(timeout);
      func(...args);
    };

    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}
