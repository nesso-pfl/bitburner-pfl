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
export const earnMoney = async (ns: NS, host: Host, from: string): Promise<void> => {
  await ns.weaken(host, {
    threads: requiredWeakenThreads(ns, host, ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host)),
  });

  const growThreads = requiredGrowThreads(ns, host);
  const increasedSecLevel = ns.growthAnalyzeSecurity(growThreads, host);
  await Promise.all([
    await ns.grow(host, { threads: requiredGrowThreads(ns, host) }),
    await ns.weaken(host, { threads: requiredWeakenThreads(ns, host, increasedSecLevel) }),
  ]);

  const growFrequency = Math.floor(ns.getGrowTime(host) / ns.getHackTime(host));
  const weakenFrequency = Math.floor(ns.getWeakenTime(host) / ns.getHackTime(host));
};

const requiredWeakenThreads = (ns: NS, host: Host, shouldWeakenAmount: number, threads = 1): number => {
  return shouldWeakenAmount > ns.weakenAnalyze(threads) ? requiredWeakenThreads(ns, host, threads + 1) : threads;
};

const requiredGrowThreads = (ns: NS, host: Host): number => {
  const requiredRate = ns.getServerMaxMoney(host) / ns.getServerMoneyAvailable(host);
  return ns.growthAnalyze(host, requiredRate);
};
