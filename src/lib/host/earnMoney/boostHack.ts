import { HackStrategy } from "/lib/host/earnMoney/calcThreads";
import { repeat } from "/util/repeat";
import { filePath } from "/util/typedPath";

export const boostHack = async (ns: NS, host: Host, hackStrategy: HackStrategy) => {
  const {
    hackServer,
    hackThreads,
    growFrequency,
    growServers,
    growThreads,
    weakenFrequency,
    weakenServers,
    weakenThreads,
  } = hackStrategy;
  ns.tprint({
    host,
    hackServer: hackServer.name,
    hackThreads,
    growFrequency,
    growServers: growServers.map((server) => server.name),
    growThreads,
    weakenFrequency,
    weakenServers: weakenServers.map((server) => server.name),
    weakenThreads,
  });
  const duration = ns.getHackTime(host) - 3;
  await repeat(
    ns,
    async () => {
      ns.exec(filePath.script.weaken.$path, hackServer.name, hackThreads, host);
      const growDelay = ns.getWeakenTime(host) - ns.getGrowTime(host) - 100;
      ns.exec(filePath.script.grow.$path, hackServer.name, hackThreads, host, growDelay);
      const hackDelay = ns.getGrowTime(host) - ns.getHackTime(host) - 100;
      ns.exec(filePath.script.hack.$path, hackServer.name, hackThreads, host, hackDelay);
    },
    duration,
  );
};
