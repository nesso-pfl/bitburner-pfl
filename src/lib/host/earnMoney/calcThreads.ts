import { findMinRamServer, HackableServer, hackableServers, requiredWeakenThreads } from "/lib/host/earnMoney/util";
import { filePath } from "/util/typedPath";

export type HackStrategy = {
  hackServer: HackableServer;
  hackThreads: number;
  growFrequency: number;
  growServers: HackableServer[];
  growThreads: number;
  weakenFrequency: number;
  weakenServers: HackableServer[];
  weakenThreads: number;
};

export const calcThreads = (ns: NS, host: Host): HackStrategy => {
  const port = ns.getPortHandle(1);
  const beforeData: HackStrategy[] = port.peek();
  const startTime = performance.now();
  const initialHackableServers = beforeData.reduce<HackableServer[]>((acc) => {
    return acc;
  }, hackableServers(ns));
  const hackStrategy = calcThreads_(ns, host, initialHackableServers);
  const afterData: HackStrategy[] = port.peek();
  const endTime = performance.now();
  // TODO: 厳密に比較する
  if (beforeData.length !== afterData.length) return calcThreads(ns, host);
  ns.tprint(`calcThreads for ${host}: ${endTime - startTime}ms`);

  port.clear();
  port.write([...afterData, hackStrategy]);
  return hackStrategy;
};

const calcThreads_ = (ns: NS, host: Host, initialHackableServers: HackableServer[], earnRate = 0.98): HackStrategy => {
  const hackThreads = Math.floor(ns.hackAnalyzeThreads(host, ns.getServerMaxMoney(host) * earnRate));
  const hackCost = hackThreads * ns.getScriptRam(filePath.script.hackDaemon.$path);
  const { server: hackServer, hackableServers: hackableServersAfterHack } = findMinRamServer(
    initialHackableServers,
    hackCost,
  );
  if (hackServer === undefined) return calcThreads_(ns, host, initialHackableServers, earnRate - 0.01);

  const growFrequency = Math.ceil(ns.getGrowTime(host) / ns.getHackTime(host));
  const growThreads = Math.ceil(ns.growthAnalyze(host, 1 / (1 - earnRate)));
  const growCost = growThreads * ns.getScriptRam(filePath.script.growDaemon.$path);
  const growResult = [...new Array(growFrequency).keys()].reduce<
    { servers: HackableServer[]; hackableServers: HackableServer[] } | undefined
  >(
    (acc) => {
      if (acc === undefined) return undefined;

      const { server: growServer, hackableServers: newHackableServers } = findMinRamServer(
        acc.hackableServers,
        growCost,
      );
      return growServer === undefined
        ? undefined
        : { servers: [...acc.servers, growServer], hackableServers: newHackableServers };
    },
    { servers: [], hackableServers: hackableServersAfterHack },
  );
  if (growResult === undefined) return calcThreads_(ns, host, initialHackableServers, earnRate - 0.01);
  const { servers: growServers, hackableServers: hackableServersAfterGrow } = growResult;

  const increaseSecLevel = ns.hackAnalyzeSecurity(hackThreads, host) + ns.growthAnalyzeSecurity(growThreads, host);
  const weakenFrequency = Math.ceil(ns.getWeakenTime(host) / ns.getHackTime(host));
  const weakenThreads = requiredWeakenThreads(ns, host, increaseSecLevel);
  const weakenResult = [...new Array(growFrequency).keys()].reduce<
    { servers: HackableServer[]; hackableServers: HackableServer[] } | undefined
  >(
    (acc) => {
      if (acc === undefined) return undefined;

      const { server: weakenServer, hackableServers: newHackableServers } = findMinRamServer(
        acc.hackableServers,
        growCost,
      );
      return weakenServer === undefined
        ? undefined
        : { servers: [...acc.servers, weakenServer], hackableServers: newHackableServers };
    },
    { servers: [], hackableServers: hackableServersAfterGrow },
  );
  if (weakenResult === undefined) return calcThreads_(ns, host, initialHackableServers, earnRate - 0.01);
  const { servers: weakenServers } = weakenResult;

  return {
    hackServer,
    hackThreads,
    growFrequency,
    growServers,
    growThreads,
    weakenFrequency,
    weakenServers,
    weakenThreads,
  };
};
