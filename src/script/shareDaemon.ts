import { getTeraStats } from '/lib/tera/getTeraStats';
import { arg } from '/util/arg';
import { filePath } from '/util/typedPath';

export async function main(ns: NS): Promise<void> {
  const teraIndex = arg(ns.args[0], 'number');
  const tera = `tera${teraIndex}`;
  const thread = Math.floor(
    (getTeraStats(ns).find((t) => t.name === tera)?.availableRam ?? 0) / ns.getScriptRam(filePath.script.share.$path),
  );

  ns.exec(filePath.script.share.$path, tera, thread);
}
