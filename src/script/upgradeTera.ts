import { upgradeTera } from "/lib/tera/upgradeTera";
import { arg } from "/util/arg";

export async function main(ns: NS): Promise<void> {
  const i = arg(ns.args[0], "number");
  upgradeTera(ns, i);
}
