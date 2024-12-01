export const repeat = async (ns: NS, fn: () => unknown, duration: number) => {
  await fn();
  await ns.sleep(duration);
  await repeat(ns, fn, duration);
};
