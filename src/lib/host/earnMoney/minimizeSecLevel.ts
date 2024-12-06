import { getMaxRamServer, findMinRamServer, hackableServers, requiredWeakenThreads } from '/lib/host/earnMoney/util';
import { repeat } from '/util/repeat';
import { filePath } from '/util/typedPath';

/**
 * host の secLevel を最小化する
 * 一発で最小化できる server があればそこに weakenDaemon を配置する.
 * なければ、availableRam が最大の server に weakenDaemon を配置する.
 * wekenDaemon が終了するまで待つ
 */
export const minimizeSecLevel = async (ns: NS, host: Host): Promise<void> => {
  if (ns.getServerSecurityLevel(host) === ns.getServerMinSecurityLevel(host)) return;

  const maxWeakenThreads = requiredWeakenThreads(
    ns,
    host,
    ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host),
  );
  const weakenCost = ns.getScriptRam(filePath.script.weaken.$path, 'home') * maxWeakenThreads;
  const { server } = findMinRamServer(hackableServers(ns), weakenCost);

  if (server === undefined) {
    const maxServer = getMaxRamServer(ns, hackableServers(ns));
    const weakenThreads = Math.floor(maxServer.availableRam / ns.getScriptRam(filePath.script.weakenDaemon.$path));
    const pid = ns.exec(filePath.script.weakenDaemon.$path, maxServer.name, weakenThreads, host, true);
    await repeat(ns, () => {}, 1000, { until: (ns) => !ns.isRunning(pid) });
  } else {
    const pid = ns.exec(filePath.script.weakenDaemon.$path, server.name, maxWeakenThreads, host, true);
    await repeat(ns, () => {}, 1000, { until: (ns) => !ns.isRunning(pid) });
  }
  ns.tprint(`${host} secLevel minimized`);
};
