import { HackStrategy } from '/lib/host/earnMoney/calcThreads';
import { findMinRamServer, hackableServers } from '/lib/host/earnMoney/util';
import { repeat } from '/util/repeat';
import { filePath } from '/util/typedPath';

export const boostHack = async (ns: NS, host: Host, hackStrategy: HackStrategy) => {
  const { hackThreads, growThreads, weakenThreads } = hackStrategy;
  ns.tprint({ host, hackThreads, growThreads, weakenThreads });
  const duration = ns.getHackTime(host) * 4 + 100;
  await repeat(
    ns,
    async () => {
      const { server: weakenServer } = findMinRamServer(
        hackableServers(ns),
        weakenThreads * ns.getScriptRam(filePath.script.weaken.$path),
      );
      if (!weakenServer) throw new Error('No server found to weaken');
      ns.exec(filePath.script.weaken.$path, weakenServer.name, weakenThreads, host);
      const { server: growServer } = findMinRamServer(
        hackableServers(ns),
        growThreads * ns.getScriptRam(filePath.script.grow.$path),
      );
      if (!growServer) throw new Error('No server found to grow');
      const growDelay = ns.getWeakenTime(host) - ns.getGrowTime(host) - 100;
      ns.exec(filePath.script.grow.$path, growServer.name, growThreads, host, growDelay);
      const { server: hackServer } = findMinRamServer(
        hackableServers(ns),
        hackThreads * ns.getScriptRam(filePath.script.hack.$path),
      );
      if (!hackServer) throw new Error('No server found to hack');
      const hackDelay = ns.getWeakenTime(host) - ns.getHackTime(host) - 200;
      ns.exec(filePath.script.hack.$path, hackServer.name, hackThreads, host, hackDelay);
    },
    duration,
  );
};
