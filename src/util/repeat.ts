type Option = Partial<{
  count: number;
  until: (ns: NS) => boolean;
}>;

export const repeat = async (ns: NS, fn: () => unknown, duration: number, option?: Option): Promise<void> => {
  let count = option?.count ?? Infinity;
  while (true) {
    await fn();
    count--;
    if (count < 1 || option?.until?.(ns)) return;
    await ns.sleep(duration);
  }
};
