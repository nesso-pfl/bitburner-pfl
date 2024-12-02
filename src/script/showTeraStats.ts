import { getTeraStats } from "/lib/tera/getTeraStats";
import { tprintTable } from "/util/tprintTable";

export async function main(ns: NS): Promise<void> {
  const data = getTeraStats(ns).map((tera) => ({
    name: tera.name,
    maxRam: ns.formatRam(tera.maxRam),
    availableRam: ns.formatRam(tera.maxRam - tera.usedRam),
    upgradeCost: ns.formatNumber(tera.upgradeCost),
  }));
  tprintTable(ns, data, ["name", "maxRam", "availableRam", "upgradeCost"]);
}
