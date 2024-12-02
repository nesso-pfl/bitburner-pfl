export const getTeraStats = (ns: NS) => {
  return ns.getPurchasedServers().map((tera) => {
    return {
      name: tera,
      maxRam: ns.getServerMaxRam(tera),
      usedRam: ns.getServerUsedRam(tera),
    };
  });
};
