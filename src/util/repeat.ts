export const repeat = async (ns: NS, fn: () => Promise<unknown>, duration = 2000) => {
  while (true) {
    await fn();
    await ns.sleep(duration);
  }
};
