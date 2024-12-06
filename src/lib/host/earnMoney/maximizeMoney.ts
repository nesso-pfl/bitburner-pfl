import { findMinRamServer, hackableServers, requiredWeakenThreads } from '/lib/host/earnMoney/util';
import { repeat } from '/util/repeat';
import { filePath } from '/util/typedPath';

/**
 * host の availableMoney を最大化する
 */
export const maximizeMoney = async (ns: NS, host: Host): Promise<void> => {
  if (ns.getServerMoneyAvailable(host) === ns.getServerMaxMoney(host)) return;

  const { growServer, growThreads, weakenServer, weakenThreads } = calcThreadsAndServerForGrowAndWeaken(ns, host);
  const growPid = ns.exec(filePath.script.growDaemon.$path, growServer, growThreads, host, true);
  const weakenPid = ns.exec(filePath.script.weakenDaemon.$path, weakenServer, weakenThreads, host, true, growPid);
  await repeat(ns, () => {}, 1000, {
    until: (ns) => !ns.isRunning(growPid) && !ns.isRunning(weakenPid),
  });
  ns.tprint(`${host} availableMoney maximized`);
};

const calcThreadsAndServerForGrowAndWeaken = (ns: NS, host: Host, count = 1) => {
  const growMultiplier = Math.pow(ns.getServerMaxMoney(host) / ns.getServerMoneyAvailable(host), 1 / count);
  const growThreads = Math.ceil(ns.growthAnalyze(host, growMultiplier));
  const growCost = growThreads * ns.getScriptRam(filePath.script.growDaemon.$path);
  const { server: growServer, hackableServers: newHackableServers } = findMinRamServer(hackableServers(ns), growCost);
  if (growServer === undefined) return calcThreadsAndServerForGrowAndWeaken(ns, host, count + 1);

  const weakenThreads = requiredWeakenThreads(ns, host, Math.ceil(ns.growthAnalyzeSecurity(growThreads, host)));
  const weakenCost = weakenThreads * ns.getScriptRam(filePath.script.weakenDaemon.$path);
  const { server: weakenServer } = findMinRamServer(newHackableServers, weakenCost);
  if (weakenServer === undefined) return calcThreadsAndServerForGrowAndWeaken(ns, host, count + 1);

  return { growServer: growServer.name, growThreads, weakenServer: weakenServer.name, weakenThreads };
};
