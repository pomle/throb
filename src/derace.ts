export function derace<Args extends unknown[], Result extends unknown>(
  func: (...args: Args) => Promise<Result>,
) {
  let counter = 0;

  return async function deracedFunction(
    ...args: Args
  ): Promise<[Result, boolean]> {
    const id = ++counter;

    const result = await func(...args);

    return [result, id === counter];
  };
}
