import { getHackableHosts } from "/lib/host/getHackableHosts";
import { getAllTeras } from "/lib/tera/getAllTeras";

export async function main(ns: NS): Promise<void> {
  ([...getHackableHosts(ns), ...getAllTeras(ns)] satisfies (Host | Tera)[]).forEach((server) => {
    ns.killall(server);
  });
}
