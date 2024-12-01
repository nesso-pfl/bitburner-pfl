export const repeat = async (ns: NS, fn: () => Promise<unknown>, duration: number) => {
  await fn();
  await ns.sleep(duration);
  await repeat(ns, fn, duration);
};
