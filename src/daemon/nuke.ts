import { getNukableHosts } from '/lib/host/getNukableHosts';
import { nuke } from '/lib/host/nuke';
import { repeat } from '/util/repeat';

export async function main(ns: NS): Promise<void> {
  await repeat(ns, () => getNukableHosts(ns).forEach((host) => nuke(ns, host)), 5000);
}
