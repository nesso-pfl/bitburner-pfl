import { getAllHosts } from "/lib/host/getAllHosts";

export async function main(ns: NS): Promise<void> {
  ns.tprint(getAllHosts(ns));
}
