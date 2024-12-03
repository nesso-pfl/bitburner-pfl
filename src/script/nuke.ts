import { getNukableHosts } from "/lib/host/getNukableHosts";
import { nuke } from "/lib/host/nuke";

export async function main(ns: NS): Promise<void> {
  getNukableHosts(ns)
    .filter((host) => !ns.getServer(host).hasAdminRights)
    .forEach((host) => nuke(ns, host));
}
