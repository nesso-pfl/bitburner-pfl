import { filePath } from "/util/typedPath";

const a: { host: Host; from: number | "home" }[] = [
  // { host: "n00dles", from: "home" },
  // { host: "foodnstuff", from: 0 },
  // { host: "sigma-cosmetics", from: 1 },
  // { host: "joesguns", from: 2 },
  // { host: "hong-fang-tea", from: 3 },
  // { host: "harakiri-sushi", from: 4 },
  // { host: "iron-gym", from: 5 },
  // { host: "zer0", from: 6 },
  // { host: "nectar-net", from: 7 },
  // { host: "max-hardware", from: 8 },
  // { host: "phantasy", from: 9 },
  // { host: "omega-net", from: 10 },
  // { host: "neo-net", from: 11 },
  // { host: "silver-helix", from: 12 },
  // { host: "crush-fitness", from: 13 },
  // { host: "computek", from: 14 },
  // { host: "the-hub", from: 15 },
  // { host: "johnson-ortho", from: 16 },
];

export async function main(ns: NS): Promise<void> {
  a.forEach(({ host, from }) => ns.exec(filePath.script.earnMoney.$path, "home", 1, host, from));
}
