import { getHostStats } from '/lib/host/getHostStats';
import { toHost } from '/lib/host/toHost';
import { arg } from '/util/arg';

export async function main(ns: NS): Promise<void> {
  const host = toHost(arg(ns.args[0], 'string'));
  const delay = arg(ns.args[1], 'number', 0);
  if (host === 'kuai-gong') ns.tprint('weaken start');
  if (delay > 0) await ns.sleep(delay);
  await ns.weaken(host);
  if (host === 'kuai-gong') {
    ns.tprint('weakened');
    const hostStat = getHostStats(host, ns);
    ns.tprint(`secLevel: ${hostStat.hackDifficulty}`);
  }
}
