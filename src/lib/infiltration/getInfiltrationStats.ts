export type GetInfiltrationStatsReturn = {
  difficulty: number;
  location: string;
  probleams: number;
  startSecLevel: number;
  SoARep: number;
  sellCash: number;
  tradeRep: number;
};

export const getInfiltrationStats = (
  ns: NS,
  location: LocationName | `${LocationName}`,
): GetInfiltrationStatsReturn => {
  const infiltrationLocation = ns.infiltration.getInfiltration(location);
  return {
    difficulty: infiltrationLocation.difficulty,
    location: infiltrationLocation.location.name,
    probleams: infiltrationLocation.maxClearanceLevel,
    startSecLevel: infiltrationLocation.startingSecurityLevel,
    SoARep: infiltrationLocation.reward.SoARep,
    sellCash: infiltrationLocation.reward.sellCash,
    tradeRep: infiltrationLocation.reward.tradeRep,
  };
};
