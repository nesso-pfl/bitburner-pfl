import { calcThreads } from "/lib/host/earnMoney/calcThreads";
import { easyHack } from "/lib/host/earnMoney/easyHack";
import { maximizeMoney } from "/lib/host/earnMoney/maximizeMoney";
import { minimizeSecLevel } from "/lib/host/earnMoney/minimizeSecLevel";

export const earnMoney = async (ns: NS, host: Host): Promise<void> => {
  await minimizeSecLevel(ns, host);
  await maximizeMoney(ns, host);
  const hackStrategy = calcThreads(ns, host);
  await easyHack(ns, host, hackStrategy);
};