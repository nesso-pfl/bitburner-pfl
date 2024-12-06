import { crimes } from '/lib/crime/crimes';
import { tprintTable } from '/util/tprintTable';
export async function main(ns: NS): Promise<void> {
  const data = crimes
    .map((crime) => ns.singularity.getCrimeStats(crime))
    .map((stats) => ({
      type: stats.type,
      mps: (stats.money / stats.time) * 1000,
      exp: stats.strength_exp + stats.defense_exp + stats.dexterity_exp + stats.agility_exp,
      expps: ((stats.strength_exp + stats.defense_exp + stats.dexterity_exp + stats.agility_exp) / stats.time) * 1000,
    }));
  tprintTable(ns, data, ['type', 'mps', 'expps']);
}
