import { getHackableHosts } from "/lib/host/getHackableHosts";
import { buyTera } from "/lib/tera/buyTera";
import { getAllTeras } from "/lib/tera/getAllTeras";
import { copyScripts } from "/util/copyScripts";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  repeat(ns, () => buyTera(ns), 2000);
  repeat(ns, () => [...getHackableHosts(ns), ...getAllTeras(ns)].forEach((server) => copyScripts(ns, server)), 5000);
  await repeat(ns, () => ns.sleep(10000), 365 * 24 * 60 * 60 * 1000);
}
