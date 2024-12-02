import { toHost } from "/lib/host/toHost";
import { arg } from "/util/arg";
import { filePath } from "/util/typedPath";

export async function main(ns: NS): Promise<void> {
  const from = arg(ns.args[0], "string");
  const host = toHost(arg(ns.args[1], "string"));
  const port = arg(ns.args[2], "number");
  const threads = arg(ns.args[3], "number");
  ns.exec(filePath.script.grow.$path, from, threads, host);
  ns.tprint("g wait");
  await ns.nextPortWrite(port);
  ns.tprint("g read");
  ns.readPort(port);
  ns.writePort(port, "Start growing");
  ns.tprint("g write");
  await main(ns);
}

// script/g.js: g wait
// script/g.js: g read
// script/w.js: w write
// script/w.js: w wait
// script/g.js: g write
//
// script/g.js: g wait
// script/w.js: w read
// script/g.js: g read
// script/w.js: w write
// script/w.js: w wait
// script/g.js: g write
// script/g.js: g wait
// script/w.js: w read
// script/g.js: g read
// script/w.js: w write
// script/w.js: w wait
// script/g.js: g write
// script/g.js: g wait
// script/w.js: w read
// script/g.js: g read
