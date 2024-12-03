import { registerPort } from "/lib/port/registerPort";
import { repeat } from "/util/repeat";
import { filePath } from "/util/typedPath";

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

const minimizeSecLevel = async (ns: NS, host: Host, from: Host | Tera): Promise<void> => {
  if (ns.getServerSecurityLevel(host) === ns.getServerMinSecurityLevel(host)) return;

  const weakenTime = ns.getWeakenTime(host);
  const weakenThreads = requiredWeakenThreads(
    ns,
    host,
    ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host),
  );
  const weakenCost = ns.getScriptRam(filePath.script.weaken.$path, from) * weakenThreads;
  if (weakenCost > ns.getServerMaxRam(from) - ns.getServerUsedRam(from))
    throw new Error(
      `Not enough ram. ramCost: ${weakenCost}, availableRam: ${ns.getServerMaxRam(from) - ns.getServerUsedRam(from)}`,
    );

  ns.exec(filePath.script.weaken.$path, from, weakenThreads, host);
  await ns.sleep(weakenTime);
  ns.tprint(`${host} secLevel minimized`);
};

const maximizeMoney = async (ns: NS, host: Host, from: Host | Tera): Promise<void> => {
  if (ns.getServerMoneyAvailable(host) === ns.getServerMaxMoney(host)) return;

  const availableRam = ns.getServerMaxRam(from) - ns.getServerUsedRam(from);
  // TODO: grow, weaken の threads の最適化
  const growThreads = requiredGrowThreads(ns, host, availableRam * 0.8);
  // const weakenThreads = requiredWeakenThreads(ns, host, Math.ceil(ns.growthAnalyzeSecurity(growThreads, host)));
  const weakenThreads = Math.floor(
    (availableRam - ns.getScriptRam(filePath.script.growDaemon.$path) * growThreads) /
      ns.getScriptRam(filePath.script.weakenDaemon.$path),
  );
  const growPid = ns.exec(filePath.script.growDaemon.$path, from, growThreads, host, true);
  const weakenPid = ns.exec(filePath.script.weakenDaemon.$path, from, weakenThreads, host, true, growPid);
  await repeat(ns, () => {}, 1000, {
    until: (ns) => !ns.isRunning(growPid) && !ns.isRunning(weakenPid),
  });
  ns.tprint(`${host} availableMoney maximized`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gracefulHack = async (ns: NS, host: Host, from: Host | Tera) => {
  const {
    hackThreads,
    growThreads: growThreads_,
    weakenThreads,
    weakenFrequency,
  } = calcThreads(ns, host, ns.getServerMaxRam(from) - ns.getServerUsedRam(from));
  const hackPort = registerPort(ns);
  if (weakenFrequency > 2) {
    await repeat(
      ns,
      () => {
        const growPort = registerPort(ns);
        ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
        ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
      },
      ns.getHackTime(host),
      { count: weakenFrequency - 2 },
    );
  }
  await ns.sleep(ns.getHackTime(host));
  const growPort = registerPort(ns);
  ns.exec(filePath.script.h.$path, from, 1, from, host, hackPort, hackThreads);
  ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
  ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
  if (weakenFrequency > 1) {
    await ns.sleep(ns.getHackTime(host));
    const growPort = registerPort(ns);
    ns.exec(filePath.script.g.$path, from, 1, from, host, growPort, growThreads_);
    ns.exec(filePath.script.w.$path, from, 1, from, host, weakenThreads, hackPort, growPort);
  }
};

const easyHack = async (ns: NS, host: Host, from: Host | Tera) => {
  const {
    hackThreads,
    growThreads: growThreads_,
    weakenThreads,
    weakenFrequency,
    ramCost,
  } = calcThreads(ns, host, ns.getServerMaxRam(from) - ns.getServerUsedRam(from) * 0.9);
  ns.tprint({
    host,
    from,
    hackThreads,
    growThreads: growThreads_,
    weakenThreads,
    weakenFrequency,
    ramCost,
  });
  if (ramCost > ns.getServerMaxRam(from) - ns.getServerUsedRam(from)) {
    throw new Error(
      `Not enough ram. ramCost: ${ramCost}, availableRam: ${ns.getServerMaxRam(from) - ns.getServerUsedRam(from)}`,
    );
  }
  ns.exec(filePath.script.hackDaemon.$path, from, hackThreads, host);
  await ns.sleep(10);
  await repeat(
    ns,
    async () => {
      ns.exec(filePath.script.growDaemon.$path, from, growThreads_, host);
      await ns.sleep(10);
      ns.exec(filePath.script.weakenDaemon.$path, from, weakenThreads, host);
    },
    ns.getHackTime(host),
    { count: weakenFrequency },
  );
};

export const earnMoney = async (ns: NS, host: Host, from: Host | Tera): Promise<void> => {
  await minimizeSecLevel(ns, host, from);
  await maximizeMoney(ns, host, from);
  await easyHack(ns, host, from);
};

const requiredWeakenThreads = (ns: NS, host: Host, shouldWeakenAmount: number, threads = 1): number => {
  return shouldWeakenAmount > ns.weakenAnalyze(threads)
    ? requiredWeakenThreads(ns, host, shouldWeakenAmount, threads + 1)
    : threads;
};

const requiredGrowThreads = (ns: NS, host: Host, availableRam?: number): number => {
  const requiredRate = ns.getServerMaxMoney(host) / ns.getServerMoneyAvailable(host);
  const maxCount = availableRam
    ? Math.floor(availableRam / ns.getScriptRam(filePath.script.growDaemon.$path))
    : Infinity;
  return ns.growthAnalyze(host, requiredRate) > maxCount ? maxCount : Math.ceil(ns.growthAnalyze(host, requiredRate));
};

const calcThreads = (
  ns: NS,
  host: Host,
  availableRam: number,
  earnRate = 0.98,
): {
  hackThreads: number;
  growThreads: number;
  weakenThreads: number;
  growFrequency: number;
  weakenFrequency: number;
  ramCost: number;
  earnRate: number;
} => {
  const growFrequency = Math.ceil(ns.getGrowTime(host) / ns.getHackTime(host));
  const weakenFrequency = Math.ceil(ns.getWeakenTime(host) / ns.getHackTime(host));
  const hackThreads = Math.floor(ns.hackAnalyzeThreads(host, ns.getServerMaxMoney(host) * earnRate));
  const growThreads = Math.ceil(ns.growthAnalyze(host, 1 / (1 - earnRate)));
  const weakenThreads = growThreads > 20 ? Math.ceil(growThreads / 10) : 20;
  const ramCost =
    hackThreads * ns.getScriptRam(filePath.script.hackDaemon.$path) +
    growFrequency * growThreads * ns.getScriptRam(filePath.script.growDaemon.$path) +
    weakenFrequency * weakenThreads * ns.getScriptRam(filePath.script.weakenDaemon.$path);
  return ramCost >
    availableRam -
      ns.getScriptRam(filePath.script.h.$path) -
      growFrequency * ns.getScriptRam(filePath.script.g.$path) -
      weakenFrequency * ns.getScriptRam(filePath.script.w.$path)
    ? calcThreads(ns, host, availableRam, earnRate - 0.01)
    : {
        hackThreads,
        growThreads,
        weakenThreads,
        growFrequency,
        weakenFrequency,
        ramCost,
        earnRate,
      };
};
