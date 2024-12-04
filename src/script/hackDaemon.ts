import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  const duration = arg(ns.args[1], "number", 0);
  await repeat(ns, async () => await ns.hack(host), duration);
}
