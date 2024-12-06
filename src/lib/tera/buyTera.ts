const PURCHASE_RATE = 0.9;
const UPGRADE_RATE = 0.5;
const INITIAL_PURCHASE_RAM = 2 ** 12;
const purchaseMessage = (tera: string) => `Purchase ${tera}\n`;
const upgradeMessage = (teras: string[]) => `Upgrade ${teras.map((tera) => tera.substring(4)).join(', ')}`;

export const buyTera = async (ns: NS) => {
  const ownedTera = ns.getPurchasedServers();
  const shouldPurchaseTera =
    ownedTera.length < ns.getPurchasedServerLimit() &&
    ns.getServerMoneyAvailable('home') * PURCHASE_RATE > ns.getPurchasedServerCost(INITIAL_PURCHASE_RAM);
  if (shouldPurchaseTera) {
    ns.purchaseServer(`tera${ownedTera.length}`, INITIAL_PURCHASE_RAM);
  }

  const shouldUpgradeTeras = ownedTera.reduce<Tera[]>((prev, cur) => {
    const upgradeCost = [...prev, cur].reduce(
      (prev_, cur_) => prev_ + ns.getPurchasedServerUpgradeCost(cur_, ns.getServerMaxRam(cur_) * 2),
      0,
    );
    return ns.getServerMoneyAvailable('home') * UPGRADE_RATE > upgradeCost ? [...prev, cur] : prev;
  }, []);
  shouldUpgradeTeras.forEach((server) => ns.upgradePurchasedServer(server, ns.getServerMaxRam(server) * 2));

  if (shouldPurchaseTera || shouldUpgradeTeras.length) {
    ns.toast(
      `${shouldPurchaseTera ? purchaseMessage(`tera${ownedTera.length}`) : ''}
${shouldUpgradeTeras.length ? upgradeMessage(shouldUpgradeTeras) : ''}`,
      'info',
      2000,
    );
  }
};
