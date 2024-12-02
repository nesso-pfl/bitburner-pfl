import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { repeat } from "/util/repeat";
import { filePath } from "/util/typedPath";

export async function main(ns: NS): Promise<void> {
  const from = arg(ns.args[0], "string");
  const host = toHost(arg(ns.args[1], "string"));
  const threads = arg(ns.args[2], "number");
  const hackPort = arg(ns.args[3], "number");
  const growPort = arg(ns.args[4], "number");
  const pid = ns.exec(filePath.script.weaken.$path, from, threads, host);
  await repeat(ns, () => {}, 50, { until: (ns) => !ns.isRunning(pid) });
  ns.writePort(hackPort, "Weakened");
  ns.writePort(growPort, "Weakened");
  ns.tprint("w write");
  ns.tprint("w wait");
  await repeat(ns, () => {}, 50, {
    until: (ns) => !ns.getPortHandle(hackPort).empty() && !ns.getPortHandle(growPort).empty(),
  });
  ns.readPort(hackPort);
  ns.readPort(growPort);
  ns.tprint("w read");
  await main(ns);
}
