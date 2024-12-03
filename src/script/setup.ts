import { filePath } from "/util/typedPath";

const a: { host: Host; from: number }[] = [
  { host: "foodnstuff", from: 0 },
  { host: "sigma-cosmetics", from: 1 },
  { host: "joesguns", from: 2 },
  { host: "hong-fang-tea", from: 3 },
  { host: "harakiri-sushi", from: 4 },
];

export async function main(ns: NS): Promise<void> {
  a.forEach(({ host, from }) => ns.exec(filePath.script.earnMoney.$path, "home", 1, host, from));
}
