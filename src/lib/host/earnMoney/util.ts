import { getHackableHosts } from '/lib/host/getHackableHosts';
import { getHostStats } from '/lib/host/getHostStats';
import { getTeraStats } from '/lib/tera/getTeraStats';

export const requiredWeakenThreads = (
  ns: NS,
  host: Host,
  increaseSecLevel: number,
  threads = 1,
  gracefully = false,
): number => {
  if (gracefully) {
    return increaseSecLevel > ns.weakenAnalyze(threads)
      ? requiredWeakenThreads(ns, host, increaseSecLevel, threads + 1, gracefully)
      : threads;
  } else {
    return Math.ceil(increaseSecLevel / ns.weakenAnalyze(threads));
  }
};

export const hackableServers = (ns: NS) => [
  ...getHackableHosts(ns).map((host) => getHostStats(host, ns)),
  ...getTeraStats(ns),
];
export type HackableServer = ReturnType<typeof hackableServers>[number];
/** availableRam が最大のサーバーを取得 */
export const getMaxRamServer = (ns: NS, hackableServers: HackableServer[]) =>
  hackableServers.reduce((acc, cur) => (acc.availableRam > cur.availableRam ? acc : cur));
export const findMinRamServer = (hackableServers: HackableServer[], requiredRam: number) => {
  const server = hackableServers
    .filter((server) => server.availableRam > requiredRam)
    .reduce<
      HackableServer | undefined
    >((acc, cur) => (acc === undefined ? cur : acc.availableRam < cur.availableRam ? acc : cur), undefined);
  const newHackableServers =
    server === undefined
      ? hackableServers
      : hackableServers.map((s) =>
          s.name === server.name
            ? {
                ...s,
                availableRam: s.availableRam - requiredRam,
              }
            : s,
        );

  return { server, hackableServers: newHackableServers };
};
