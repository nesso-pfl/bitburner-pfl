import { tprintTable } from '/util/tprintTable';
import { getUsefulInfiltrations } from '/lib/infiltration/getUsefulInfiltrations';

type Sort = 'sellCash' | 'tradeRep';

export async function main(ns: NS): Promise<void> {
  const sort: Sort = 'sellCash';
  const data = getUsefulInfiltrations(ns)
    .toSorted((a, b) => (a[sort] > b[sort] ? 1 : -1))
    .map((x) => ({
      ...x,
      SoARep: ns.formatNumber(x.SoARep),
      sellCash: ns.formatNumber(x.sellCash),
      tradeRep: ns.formatNumber(x.tradeRep),
      cashPerProblem: ns.formatNumber(x.sellCash / x.probleams),
      repPerProblem: ns.formatNumber(x.tradeRep / x.probleams),
    }));
  tprintTable(ns, data, [
    'location',
    'difficulty',
    'probleams',
    'startSecLevel',
    'SoARep',
    'sellCash',
    'tradeRep',
    'cashPerProblem',
    'repPerProblem',
  ]);
}
