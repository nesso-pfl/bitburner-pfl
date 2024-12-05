import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  const delay = arg(ns.args[1], "number", 0);
  if (delay > 0) await ns.sleep(delay);
  await ns.hack(host);
}
