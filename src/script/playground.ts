import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const hosts = ns.scan("home");
  const a = hosts.map((host) => {
    const b = ns.scan(host).filter((host) => host !== "home");
    return [host, ...b];
  });
  ns.tprint(a);
}
