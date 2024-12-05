import { getHackableHosts } from "/lib/host/getHackableHosts";
import { getHostStats } from "/lib/host/getHostStats";
import { toHost } from "/lib/host/toHost";
import { getAllTeras } from "/lib/tera/getAllTeras";
import { tprintTable } from "/util/tprintTable";
import { filePath } from "/util/typedPath";

export async function main(ns: NS): Promise<void> {
  const processes = ([...getHackableHosts(ns), ...getAllTeras(ns)] satisfies (Host | Tera)[]).flatMap(ns.ps);
  const showEarnMoneyStatus = (host: Host) => {
    return !processes.find(
      (process) => process.filename === filePath.script.earnMoney.$path && process.args[0] === host,
    )
      ? "N"
      : processes.find((process) => process.filename === filePath.script.weakenDaemon.$path && process.args[0] === host)
        ? "W"
        : processes.find((process) => process.filename === filePath.script.growDaemon.$path && process.args[0] === host)
          ? "G"
          : "H";
  };

  const data = getHackableHosts(ns)
    .map((host) => getHostStats(host, ns))
    .map((stat) => ({
      name: stat.hostname,
      money: (((stat.moneyAvailable ?? 0) / (stat.moneyMax ?? Infinity)) * 100).toFixed(2) + "%",
      maxMoney: stat.moneyMax ?? Infinity,
      availableRam: ns.formatRam(stat.availableRam),
      secLv: ((stat.hackDifficulty ?? 0) - (stat.minDifficulty ?? 0)).toFixed(2),
      ems: showEarnMoneyStatus(toHost(stat.hostname)),
    }));
  tprintTable(ns, data, ["name", "maxMoney", "money", "secLv", "ems"]);
}
