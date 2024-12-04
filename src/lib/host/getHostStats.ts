export const getHostStats = (host: Host, ns: NS) => {
  const server = ns.getServer(host);
  return {
    ...server,
    name: host,
    maxRam: ns.getServerMaxRam(host),
    availableRam: ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
    hackAnalyze: ns.hackAnalyze(host),
    hackAnalyzeChance: ns.hackAnalyzeChance(host),
    weakenAnalyze: ns.weakenAnalyze(1),
    growth: ns.getServerGrowth(host),
    growthAnalyze: ns.growthAnalyze(host, 300),
    growthAnalyzeSecurity: ns.growthAnalyzeSecurity(1, host),
    hackTime: ns.getHackTime(host),
    growTime: ns.getGrowTime(host),
    weakenTime: ns.getWeakenTime(host),
  };
};
