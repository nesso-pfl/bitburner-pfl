export const upgradeTera = async (ns: NS, i: number) => {
  const tera = `tera${i}` as const;
  const result = ns.upgradePurchasedServer(tera, ns.getServerMaxRam(tera) * 2);
  if (result) {
    ns.toast(`Upgrade ${tera} by ${ns.getServerMaxRam(tera) * 2}`, 'info', 2000);
  } else {
    ns.toast(`Failed to upgrade ${tera} by ${ns.getServerMaxRam(tera) * 2}`, 'error', 2000);
  }
};
