import { getHackableHosts } from "/lib/host/getHackableHosts";
import { toHost } from "/lib/host/toHost";
import { getAllTeras } from "/lib/tera/getAllTeras";
import { arg } from "/util/arg";
import { filePath } from "/util/typedPath";

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], "string"));
  ([...getHackableHosts(ns), ...getAllTeras(ns)] satisfies (Host | Tera)[]).forEach((server) => {
    ns.ps(server)
      .filter(
        (process) =>
          (process.filename === filePath.script.h.$path && process.args[1] === host) ||
          (process.filename === filePath.script.g.$path && process.args[1] === host) ||
          (process.filename === filePath.script.w.$path && process.args[1] === host) ||
          (process.filename === filePath.script.hack.$path && process.args[0] === host) ||
          (process.filename === filePath.script.grow.$path && process.args[0] === host) ||
          (process.filename === filePath.script.weaken.$path && process.args[0] === host),
      )
      .forEach((process) => ns.kill(process.pid));
  });
}
