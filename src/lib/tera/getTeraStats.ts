export const getTeraStats = async (ns: NS) => {
  ns.getPurchasedServers().map((tera) => {
    return {
      name: tera,
      maxRam: ns.getServerMaxRam(tera),
    };
  });
};
