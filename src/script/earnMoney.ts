import { earnMoney } from "/lib/host/earnMoney";
import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  if (ns.args[1] === "home") {
    await earnMoney(ns, host, "home");
  } else {
    const teraIndex = arg(ns.args[1], "number");
    await earnMoney(ns, host, `tera${teraIndex}`);
  }
}
