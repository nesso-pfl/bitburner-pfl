import { handleMasterPort } from '/lib/port/handleMasterPort';

export const clearPorts = (ns: NS) => {
  const masterPort = handleMasterPort(ns);
  const newPorts = (masterPort.read() as number[]).filter((port) => !ns.getPortHandle(port).empty());
  masterPort.write(newPorts);
};
