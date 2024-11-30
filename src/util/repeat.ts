export const repeat = async (ns: NS, fn: () => Promise<unknown>, duration: number) => {
  while (true) {
    await fn();
    await ns.sleep(duration);
  }
};
