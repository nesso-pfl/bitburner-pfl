import { repeat } from "/util/repeat";

export async function main(ns: NS): Promise<void> {
  await repeat(ns, ns.share, 0);
}
