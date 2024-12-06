import { getHackableHosts } from '/lib/host/getHackableHosts';
import { getAllTeras } from '/lib/tera/getAllTeras';
import { copyScripts } from '/util/copyScripts';
import { repeat } from '/util/repeat';

export async function main(ns: NS): Promise<void> {
  await repeat(
    ns,
    () => [...getHackableHosts(ns), ...getAllTeras(ns)].forEach((server) => copyScripts(ns, server)),
    5000,
  );
}
