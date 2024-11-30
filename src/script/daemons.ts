import { buyTera } from "/lib/tera/buyTera";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  await Promise.all([await repeat(ns, () => buyTera(ns), 2000)]);
}
