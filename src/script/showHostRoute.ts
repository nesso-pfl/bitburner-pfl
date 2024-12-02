import { getAllHostRoutes } from "/lib/host/getAllHostRoutes";
import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  ns.tprint(getAllHostRoutes(ns).find((route) => route.at(-1) === host));
}
