import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  const duration = arg(ns.args[1], "number", 0);
  let start = performance.now();
  await repeat(
    ns,
    async () => {
      ns.tprint(`s:Hack ${performance.now() - start}`);
      await ns.hack(host);
      const now = performance.now();
      ns.tprint(`Hack ${now - start}`);
      start = now;
    },
    duration,
  );
}
