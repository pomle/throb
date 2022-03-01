export function turnstyle<Args extends unknown[], Result extends unknown>(
  func: (...args: Args) => Promise<Result>,
) {
  let active = false;

  return function turnstyledFunction(...args: Args): Promise<Result> | null {
    if (active) {
      return null;
    }

    active = true;

    return func(...args)
      .then((result) => {
        active = false;
        return result;
      })
      .catch((error) => {
        active = false;
        throw error;
      });
  };
}
