import { getHackableHosts } from '/lib/host/getHackableHosts';
import { getAllTeras } from '/lib/tera/getAllTeras';
import { filePath } from '/util/typedPath';

export async function main(ns: NS): Promise<void> {
  ([...getHackableHosts(ns), ...getAllTeras(ns)] satisfies (Host | Tera)[]).forEach((server) => {
    ns.ps(server)
      .filter((process) => process.filename === filePath.script.earnMoney.$path)
      .forEach((process) => ns.kill(process.pid));
  });
}
