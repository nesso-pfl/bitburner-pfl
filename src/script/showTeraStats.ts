import { getTeraStats } from "/lib/tera/getTeraStats";
import { tprintTable } from "/util/tprintTable";

export async function main(ns: NS): Promise<void> {
  const data = getTeraStats(ns).map((tera) => ({
    name: tera.name,
    maxRam: tera.maxRam,
    availableRam: tera.maxRam - tera.usedRam,
  }));
  tprintTable(ns, data, ["name", "maxRam", "availableRam"]);
}
