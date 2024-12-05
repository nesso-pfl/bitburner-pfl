import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  const stopOnMinSecLevel = arg(ns.args[1], "boolean", false);
  const growPid = ns.args[2] ? arg(ns.args[2], "number") : undefined;
  const duration = arg(ns.args[3], "number", 0);
  let start = performance.now();
  await repeat(
    ns,
    async () => {
      await ns.weaken(host);
      const now = performance.now();
      ns.tprint(`Weaken ${now - start}`);
      start = now;
    },
    duration,
    {
      // (growPid がない または grow が停止) かつ minsecLevel でやめる
      until: (ns: NS) =>
        (!growPid || !ns.isRunning(growPid)) &&
        stopOnMinSecLevel &&
        ns.getServerSecurityLevel(host) === ns.getServerMinSecurityLevel(host),
    },
  );
}
