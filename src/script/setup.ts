import { filePath } from "/util/typedPath";

const b: Host[] = [
  // "n00dles",
  // "foodnstuff",
  // "sigma-cosmetics",
  // "joesguns",
  // "hong-fang-tea",
  // "harakiri-sushi",
  // "iron-gym",
  // "zer0",
  // "nectar-net",
  // "max-hardware",
  // "phantasy",
  // "omega-net",
  // "neo-net",
  // "silver-helix",
  // "crush-fitness",
  // "computek",
  // "the-hub",
  // "johnson-ortho",
  // "catalyst",
  // "rothman-uni",
  // "summit-uni",
  // "syscore",
  // "millenium-fitness",
  // "aevum-police",
  // "lexo-corp",
  // "rho-construction",
  // "alpha-ent",
  "omnitek",
  "kuai-gong",
  "4sigma",
  "clarkinc",
  "b-and-a",
  "blade",
  "nwo",
  "ecorp",
  "megacorp",
];

export async function main(ns: NS): Promise<void> {
  b.forEach((host) => ns.exec(filePath.script.earnMoney.$path, "home", 1, host));
}
