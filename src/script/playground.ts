import { getHackableHosts } from "/lib/host/getHackableHosts";

export async function main(ns: NS): Promise<void> {
  ns.tprint(getHackableHosts(ns));
}
