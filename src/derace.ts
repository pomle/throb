export function derace<Args extends unknown[], Result extends any>(
  func: (...args: Args) => Promise<Result>,
) {
  let counter = 0;

  return async function deracedFunction(...args: Args) {
    const id = ++counter;

    const result = await func(...args);

    if (id !== counter) {
      throw new Error('Outdated result');
    }

    return result;
  };
}
