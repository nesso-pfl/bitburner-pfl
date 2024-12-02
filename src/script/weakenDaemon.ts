import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  const stopOnMinSecLevel = arg(ns.args[0], "boolean", false);
  await repeat(ns, async () => await ns.weaken(host), 0, {
    until: (ns: NS) => stopOnMinSecLevel && ns.getServerSecurityLevel(host) === ns.getServerMinSecurityLevel(host),
  });
}
