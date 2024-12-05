import { boostHack } from "/lib/host/earnMoney/boostHack";
import { calcThreads } from "/lib/host/earnMoney/calcThreads";
import { maximizeMoney } from "/lib/host/earnMoney/maximizeMoney";
import { minimizeSecLevel } from "/lib/host/earnMoney/minimizeSecLevel";
// import { findMinRamServer, hackableServers } from "/lib/host/earnMoney/util";
// import { getHostStats } from "/lib/host/getHostStats";
// import { filePath } from "/util/typedPath";

// TODO: growThreads が足りなくて money が枯渇することがある問題を修正
// TODO: ドキュメント書きたい
// TODO: もうちょっと高頻度で hack するようにしたい
export const earnMoney = async (ns: NS, host: Host): Promise<void> => {
  await minimizeSecLevel(ns, host);
  await maximizeMoney(ns, host);
  const hackStrategy = calcThreads(ns, host);
  // await easyHack(ns, host, hackStrategy);
  // await gracefullyHack(ns, host, hackStrategy);
  await boostHack(ns, host, hackStrategy);
  /*
  ns.tprint({ host, ...hackStrategy, hackServer: undefined, growServers: undefined, weakenServers: undefined });
  // fomula を使って、growAmount が期待値と一致することを確かめる
  const { hackThreads, growThreads, weakenThreads } = hackStrategy;
  const { hackThreads: hT, growThreads: gT } = hackStrategy;
  const remainedMoneyRate = 1 - ns.hackAnalyze(host) * hT;
  const requiredGT = ns.growthAnalyze(host, 1 / remainedMoneyRate);
  const gP = ns.formulas.hacking.growPercent(ns.getServer(host), gT, ns.getPlayer());
  const hostStats = getHostStats(host, ns);
  const a = ns.formulas.hacking.growThreads(
    { ...ns.getServer(host), moneyAvailable: hostStats.moneyMax! * remainedMoneyRate },
    ns.getPlayer(),
    hostStats.moneyMax!,
    1,
  );
  ns.tprint({ host, remainedMoneyRate, requiredGT, gT, gP, a });
  // alpha-ent actually
  // hackResult 2.90%
  // growResult 99.19%
  const { server: weakenServer } = findMinRamServer(
    hackableServers(ns),
    weakenThreads * ns.getScriptRam(filePath.script.weaken.$path),
  );
  if (!weakenServer) throw new Error("No server found to weaken");
  ns.exec(filePath.script.weaken.$path, weakenServer.name, weakenThreads, host);
  const { server: growServer } = findMinRamServer(
    hackableServers(ns),
    growThreads * ns.getScriptRam(filePath.script.grow.$path),
  );
  if (!growServer) throw new Error("No server found to grow");
  const growDelay = ns.getWeakenTime(host) - ns.getGrowTime(host) - 100;
  ns.exec(filePath.script.grow.$path, growServer.name, growThreads, host, growDelay);
  const { server: hackServer } = findMinRamServer(
    hackableServers(ns),
    hackThreads * ns.getScriptRam(filePath.script.hack.$path),
  );
  if (!hackServer) throw new Error("No server found to hack");
  const hackDelay = ns.getWeakenTime(host) - ns.getHackTime(host) - 200;
  ns.exec(filePath.script.hack.$path, hackServer.name, hackThreads, host, hackDelay);
  ns.tprint({
    hackServer,
    growServer,
    weakenServer,
    hackDelay,
    hackTime: ns.getHackTime(host),
    weakenTime: ns.getWeakenTime(host),
  });
  */
};
