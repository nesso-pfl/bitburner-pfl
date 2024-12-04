type Option = Partial<{
  count: number;
  until: (ns: NS) => boolean;
}>;

export const repeat = async (
  ns: NS,
  fn: (count: number) => unknown,
  duration: number,
  option?: Option,
): Promise<void> => {
  let count = 0;
  while (true) {
    await fn(count);
    count++;
    if (count >= (option?.count ?? Infinity) || option?.until?.(ns)) return;
    await ns.sleep(duration);
  }
};
