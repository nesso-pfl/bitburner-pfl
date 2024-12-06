import { handleMasterPort } from '/lib/port/handleMasterPort';

export const unregisterPort = (ns: NS, port: number) => {
  ns.clearPort(port);
  const masterPort = handleMasterPort(ns);
  const ports: number[] = masterPort.read();
  masterPort.write(ports.filter((p) => p !== port));
};
