import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { filePath } from "/util/typedPath";

export async function main(ns: NS): Promise<void> {
  const from = arg(ns.args[0], "string");
  const host = toHost(arg(ns.args[1], "string"));
  const port = arg(ns.args[2], "number");
  const threads = arg(ns.args[3], "number");
  ns.exec(filePath.script.hack.$path, from, threads, host);
  await ns.nextPortWrite(port);
  ns.clearPort(port);
  await ns.writePort(port, "Start hacking");
  await main(ns);
}
