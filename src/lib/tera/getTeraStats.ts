export type TeraStat = ReturnType<typeof getTeraStats>[0];
export const getTeraStats = (ns: NS) => {
  return ns.getPurchasedServers().map((tera) => {
    return {
      name: tera,
      maxRam: ns.getServerMaxRam(tera),
      usedRam: ns.getServerUsedRam(tera),
      availableRam: ns.getServerMaxRam(tera) - ns.getServerUsedRam(tera),
      upgradeCost: ns.getPurchasedServerUpgradeCost(tera, ns.getServerMaxRam(tera) * 2),
    };
  });
};
