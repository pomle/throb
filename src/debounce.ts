export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
) {
  let timeout: number;

  return function debouncedFunction(...args: T) {
    const later = () => {
      window.clearTimeout(timeout);
      func(...args);
    };

    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}
