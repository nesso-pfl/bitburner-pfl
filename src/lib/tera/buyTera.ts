const PURCHASE_LATE = 0.5;
const INITIAL_PURCASE_RAM = 2 ** 4;
const purchaseMessage = (tera: string) => `Purchase ${tera}\n`;
const upgradeMessage = (teras: string[]) => `Upgrade ${teras.map((tera) => tera.substring(4)).join(", ")}`;

export const buyTera = async (ns: NS) => {
  const ownedTera = ns.getPurchasedServers();
  const shouldPurcaseTera =
    ownedTera.length < ns.getPurchasedServerLimit() &&
    ns.getServerMoneyAvailable("home") * PURCHASE_LATE > ns.getPurchasedServerCost(INITIAL_PURCASE_RAM);
  if (shouldPurcaseTera) {
    ns.purchaseServer(`tera${ownedTera.length}`, INITIAL_PURCASE_RAM);
  }

  const shouldUpgradeTeras = ownedTera.reduce<string[]>((prev, cur) => {
    const upgradeCost = [...prev, cur].reduce(
      (prev_, cur_) => prev_ + ns.getPurchasedServerUpgradeCost(cur_, ns.getServerMaxRam(cur_) * 2),
      0,
    );
    return ns.getServerMoneyAvailable("home") * PURCHASE_LATE > upgradeCost ? [...prev, cur] : prev;
  }, []);
  shouldUpgradeTeras.forEach((server) => ns.upgradePurchasedServer(server, ns.getServerMaxRam(server) * 2));

  if (shouldPurcaseTera || shouldUpgradeTeras.length) {
    ns.toast(
      `${shouldPurcaseTera ? purchaseMessage(`tera${ownedTera.length}`) : ""}
${shouldUpgradeTeras.length ? upgradeMessage(shouldUpgradeTeras) : ""}`,
      "info",
      2000,
    );
  }
};
