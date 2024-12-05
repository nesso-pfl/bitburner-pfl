import { earnMoney } from "/lib/host/earnMoney/index";
import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";

export async function main(ns: NS): Promise<void> {
  await earnMoney(ns, toHost(arg(ns.args[0], "string")));
}
