import { getHackableHosts } from "/lib/host/getHackableHosts";
import { nuke } from "/lib/host/nuke";

export async function main(ns: NS): Promise<void> {
  getHackableHosts(ns)
    .filter((host) => !ns.getServer(host).hasAdminRights)
    .forEach((host) => nuke(ns, host));
}
