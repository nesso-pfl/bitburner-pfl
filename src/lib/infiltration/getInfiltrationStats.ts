export const getInfiltrationStats = (ns: NS, location: LocationName | `${LocationName}`) => {
  const infiltrationLocation = ns.infiltration.getInfiltration(location);
  return {
    difficulty: infiltrationLocation.difficulty,
    location: infiltrationLocation.location.name,
    probleams: infiltrationLocation.maxClearanceLevel,
    startingSecurityLevel: infiltrationLocation.startingSecurityLevel,
    SoARep: infiltrationLocation.reward.SoARep,
    sellCash: infiltrationLocation.reward.sellCash,
    tradeRep: infiltrationLocation.reward.tradeRep,
  };
};
