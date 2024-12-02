import { handleMasterPort } from "/lib/port/handleMasterPort";

const INITIAL_PORT = 2;

export const registerPort = (ns: NS) => {
  const masterPort = handleMasterPort(ns);
  if (masterPort.empty()) {
    masterPort.write([INITIAL_PORT]);
    ns.clearPort(INITIAL_PORT);
    return INITIAL_PORT;
  } else {
    const ports: number[] = masterPort.read();
    const newPort = ports.reduce((acc, cur) => (acc > cur ? acc : cur), 0) + 1;
    masterPort.write([...ports, newPort]);
    ns.clearPort(newPort);
    return newPort;
  }
};
