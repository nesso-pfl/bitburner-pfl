export const getHostStats = (host: Host, ns: NS) => {
  const server = ns.getServer(host);
  return {
    ...server,
    hackAnalyze: ns.hackAnalyze(host),
    hackAnalyzeChance: ns.hackAnalyzeChance(host),
    weakenAnalyze: ns.weakenAnalyze(1),
    growthAnalyze: ns.growthAnalyze(host, 1),
    growthAnalyzeSecurity: ns.growthAnalyzeSecurity(1, host),
  };
};
