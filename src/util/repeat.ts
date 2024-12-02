type Option = Partial<{
  count: number;
  until: (ns: NS) => boolean;
}>;

export const repeat = async (ns: NS, fn: () => unknown, duration: number, option?: Option) => {
  await fn();
  if (option?.count === 1 || option?.until?.(ns)) return;
  await ns.sleep(duration);
  await repeat(ns, fn, duration, {
    count: option?.count === undefined ? option?.count : option.count - 1,
    until: option?.until,
  });
};
