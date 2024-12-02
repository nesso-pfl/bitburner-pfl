import { getHackableHosts } from "/lib/host/getHackableHosts";
import { getHostStats } from "/lib/host/getHostStats";
import { tprintTable } from "/util/tprintTable";

export async function main(ns: NS): Promise<void> {
  const data = getHackableHosts(ns)
    .map((host) => getHostStats(host, ns))
    .map((stat) => ({
      name: stat.hostname,
      money: (((stat.moneyAvailable ?? 0) / (stat.moneyMax ?? Infinity)) * 100).toFixed(2) + "%",
      maxMoney: stat.moneyMax ?? Infinity,
      secLv: ((stat.hackDifficulty ?? 0) - (stat.minDifficulty ?? 0)).toFixed(2),
    }));
  tprintTable(ns, data, ["name", "maxMoney", "money", "secLv"]);
}
