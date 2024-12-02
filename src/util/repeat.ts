export const repeat = async (ns: NS, fn: () => unknown, duration: number, count?: number) => {
  await fn();
  if (count === 1) return;
  await ns.sleep(duration);
  await repeat(ns, fn, duration, count === undefined ? count : count - 1);
};
