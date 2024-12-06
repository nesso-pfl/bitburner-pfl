import { HackStrategy } from '/lib/host/earnMoney/calcThreads';
import { repeat } from '/util/repeat';
import { filePath } from '/util/typedPath';

export const easyHack = async (ns: NS, host: Host, hackStrategy: HackStrategy) => {
  const {
    hackServer,
    hackThreads,
    growFrequency,
    growServers,
    growThreads,
    weakenFrequency,
    weakenServers,
    weakenThreads,
  } = hackStrategy;
  ns.tprint({
    host,
    hackServer: hackServer.name,
    hackThreads,
    growFrequency,
    growServers: growServers.map((server) => server.name),
    growThreads,
    weakenFrequency,
    weakenServers: weakenServers.map((server) => server.name),
    weakenThreads,
  });
  // 以下の定義があるとき:
  // f := 1 hack あたりに実行する weaken の回数
  // h := hack, g := grow, w := weaken
  // x := <h, g, w>
  // tx := x にかかる時間
  // mh := hack してから sleep する時間
  // y := <g, w>
  // mys := x 実行開始まで sleep する時間
  // mye := x が実行終了してから sleep する時間
  // 以下の条件を満たすようにする
  // f * th + f * mh = tg + mgs + mge = tw + mws + mwe
  // f * th + (f-1) * mh < tg + mgs < tw + mws
  const f = weakenFrequency;
  const th = ns.getHackTime(host);
  const mh = 200;
  const tg = ns.getGrowTime(host);
  const mgs = f * th + (f - 1) * mh - tg + 100;
  // 実装上は利用しないが、理論上の値
  const mge = f * th + f * mh - tg - mgs;
  const tw = ns.getWeakenTime(host);
  const mws = f * th + (f - 1) * mh - tw + 100;
  // 実装上は利用しないが、理論上の値
  const mwe = f * th + f * mh - tw - mws;
  ns.tprint({ th, mh, tg, mgs, mge, tw, mws, mwe });
  const start = performance.now();
  await repeat(
    ns,
    async (count) => {
      if (count === weakenFrequency - 1) {
        ns.exec(filePath.script.hackDaemon.$path, hackServer.name, hackThreads, host, mh);
        ns.tprint(`HackDaemon ${performance.now() - start}`);
      }
      // grow より weaken の方が明らかに実行時間が長いので、 mgs > mws は自明とする
      await ns.sleep(mws);
      ns.exec(filePath.script.weakenDaemon.$path, weakenServers[count].name, weakenThreads, host, false, 0, mws + mwe);
      ns.tprint(`WeakenDaemon ${performance.now() - start}`);
      await ns.sleep(mgs - mws);
      ns.exec(filePath.script.growDaemon.$path, growServers[count].name, growThreads, host, false, mgs + mge);
      ns.tprint(`GrowDaemon ${performance.now() - start}`);
    },
    th + mh - mgs,
    { count: weakenFrequency },
  );
};
