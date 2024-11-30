import { buyTera } from "/lib/tera/buyTera";
import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  await repeat(ns, () => buyTera(ns), 2000);
}
