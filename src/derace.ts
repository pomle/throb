export function derace<F extends (...args: unknown[]) => Promise<unknown>>(
  func: F,
) {
  let counter = 0;

  return async function deracedFunction(...args: Parameters<F>) {
    const id = ++counter;

    const result = await func(...args);

    if (id !== counter) {
      throw new Error("Outdated result");
    }

    return result;
  };
}
