import { repeat } from "/util/repeat";

// 1. weaken を４つに分けて配置
// 2. secLevel が min になるまで weaken を繰り返す
// 3. grow を４つに分けて配置
// - 各 grow は実行都度 weakenTime - growTime だけ待つ
// - grow の数は secLevel が上昇しないように調整する
// 4. availableMoney が 100% になるまで grow を繰り返す
// 5. hack を配置
// - hack の数は availableMoney が 100% を保てるように調整する
// 一番効率が良いところに全部つぎ込むのが良いはずだが、一番効率の良いところを探す必要がある
// 一旦 core 無しの状態で実装してみる
// weaken して、 grow して、 hack する過程で、grow とか hack を最短で差し込む余地がある
// 求めた threads によって weaken, grow を行うが、これが maxRam に収まるかどうかを考える必要がある
// grow と weaken を同時に行えば時間効率は良いだろう
// hack, grow, weaken を同時に行うので、hack が連続する期間が初期に発生し、それにより availableMoney が低下する恐れがある
// hack の頻度によってその host で稼げる money は上下するし、それによって grow, weaken の頻度も変わる
export const earnMoney = async (ns: NS, host: Host, from: Host | Tera): Promise<void> => {
  await ns.weaken(host, {
    threads: requiredWeakenThreads(ns, host, ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host)),
  });

  const growThreads = requiredGrowThreads(ns, host);
  const increasedSecLevel = ns.growthAnalyzeSecurity(growThreads, host);
  await Promise.all([
    await ns.grow(host, { threads: requiredGrowThreads(ns, host) }),
    await ns.weaken(host, { threads: requiredWeakenThreads(ns, host, increasedSecLevel) }),
  ]);

  const {
    hackThreads,
    growThreads: growThreads_,
    weakenThreads,
    growFrequency,
    weakenFrequency,
  } = calcThreads(ns, host, ns.getServerMaxRam(from));
  const hack = (delay: number) => async () => {
    if (delay > 0) await ns.sleep(delay);
    await repeat(ns, async () => await ns.hack(host, { threads: hackThreads }), 0);
  };
  const grow = (delay: number) => async () => {
    if (delay > 0) await ns.sleep(delay);
    await repeat(ns, async () => await ns.grow(host, { threads: growThreads_ }), 0);
  };
  const weaken = (delay: number) => async () => {
    if (delay > 0) await ns.sleep(delay);
    await repeat(ns, async () => await ns.weaken(host, { threads: weakenThreads }), 0);
  };

  await Promise.all([
    hack(0),
    ...[...new Array(growFrequency).keys()].map((i) => grow((ns.getHackTime(host) * (i + 1)) / growFrequency)),
    ...[...new Array(weakenFrequency).keys()].map((i) => weaken((ns.getHackTime(host) * (i + 1)) / weakenFrequency)),
  ]);
};

const requiredWeakenThreads = (ns: NS, host: Host, shouldWeakenAmount: number, threads = 1): number => {
  return shouldWeakenAmount > ns.weakenAnalyze(threads) ? requiredWeakenThreads(ns, host, threads + 1) : threads;
};

const requiredGrowThreads = (ns: NS, host: Host): number => {
  const requiredRate = ns.getServerMaxMoney(host) / ns.getServerMoneyAvailable(host);
  return ns.growthAnalyze(host, requiredRate);
};

const calcThreads = (
  ns: NS,
  host: Host,
  maxRam: number,
  earnRate = 0.98,
): {
  hackThreads: number;
  growThreads: number;
  weakenThreads: number;
  growFrequency: number;
  weakenFrequency: number;
} => {
  const growFrequency = Math.floor(ns.getGrowTime(host) / ns.getHackTime(host));
  const weakenFrequency = Math.floor(ns.getWeakenTime(host) / ns.getHackTime(host));
  const hackThreads = ns.hackAnalyzeThreads(host, ns.getServerMaxMoney(host) * earnRate);
  const growThreads = ns.growthAnalyze(host, 1 / (1 - earnRate));
  const weakenThreads = requiredWeakenThreads(ns, host, ns.growthAnalyzeSecurity(growThreads, host));
  const ramCost =
    hackThreads * ns.getFunctionRamCost("hack") +
    growFrequency * growThreads * ns.getFunctionRamCost("grow") +
    weakenFrequency * weakenThreads * ns.getFunctionRamCost("weaken");
  return ramCost > maxRam
    ? calcThreads(ns, host, maxRam, earnRate - 0.01)
    : {
        hackThreads,
        growThreads,
        weakenThreads,
        growFrequency,
        weakenFrequency,
      };
};
