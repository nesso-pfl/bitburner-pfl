import { filePath } from '/util/typedPath';

export async function main(ns: NS): Promise<void> {
  ns.exec(filePath.daemon.buyTera.$path, 'home', { preventDuplicates: true });
  ns.exec(filePath.daemon.copyScripts.$path, 'home', { preventDuplicates: true });
  ns.exec(filePath.daemon.nuke.$path, 'home', { preventDuplicates: true });
}
