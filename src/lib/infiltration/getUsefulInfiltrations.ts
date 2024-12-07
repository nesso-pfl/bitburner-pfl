import { getInfiltrationStats, InfiltrationStats } from '/lib/infiltration/getInfiltrationStats';

export const getUsefulInfiltrations = (ns: NS) => {
  return ns.infiltration
    .getPossibleLocations()
    .map((location) => getInfiltrationStats(ns, location.name))
    .reduce<InfiltrationStats[]>((acc, cur) => {
      const isUseful = acc.every((x) => !isUnusefulInfiltration(cur, x));
      return isUseful ? [...acc.filter((x) => !isUnusefulInfiltration(x, cur)), cur] : acc;
    }, []);
};

const isUnusefulInfiltration = (in1: InfiltrationStats, in2: InfiltrationStats) => {
  return (
    in1.difficulty >= in2.difficulty &&
    in1.probleams >= in2.probleams &&
    in1.sellCash <= in2.sellCash &&
    in1.tradeRep <= in2.tradeRep
  );
};
