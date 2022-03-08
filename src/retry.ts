function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function retry<Args extends unknown[], Result extends unknown>(
  func: (...args: Args) => Promise<Result>,
  backoff: Generator<number> | number[],
) {
  function* delay() {
    yield 0;
    yield* backoff;
  }

  return async function retriedFunction(...args: Args): Promise<Result> {
    const errors: any[] = [];

    for (const time of delay()) {
      try {
        if (time > 0) {
          await sleep(time);
        }

        return await func(...args);
      } catch (error: any) {
        errors.push(error);
      }
    }

    throw errors;
  };
}
