import { HackStrategy } from "/lib/host/earnMoney/calcThreads";
import { registerPort } from "/lib/port/registerPort";
import { repeat } from "/util/repeat";
import { filePath } from "/util/typedPath";

export const gracefullyHack = async (ns: NS, host: Host, from: Host | Tera, hackStrategy: HackStrategy) => {
  const { hackThreads, growThreads: growThreads_, weakenThreads, weakenFrequency } = hackStrategy;
  const hackPort = registerPort(ns);
  if (weakenFrequency > 2) {
    await repeat(
      ns,
      () => {
        const growPort = registerPort(ns);
        ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
        ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
      },
      ns.getHackTime(host),
      { count: weakenFrequency - 2 },
    );
  }
  await ns.sleep(ns.getHackTime(host));
  const growPort = registerPort(ns);
  ns.exec(filePath.script.h.$path, from, 1, from, host, hackPort, hackThreads);
  ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
  ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
  if (weakenFrequency > 1) {
    await ns.sleep(ns.getHackTime(host));
    const growPort = registerPort(ns);
    ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
    ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
  }
};
