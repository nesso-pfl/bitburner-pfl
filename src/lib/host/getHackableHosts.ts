import { getAllHosts } from "/lib/host/getAllHosts";

export const getHackableHosts = (ns: NS) => {
  return getAllHosts(ns).filter((host) => {
    const server = ns.getServer(host);
    const homeFiles = ns.ls("home");

    return (
      (server.openPortCount ?? 0) +
        [
          homeFiles.includes("BruteSSH.exe") && !server.sshPortOpen,
          homeFiles.includes("FTPCrack.exe") && !server.ftpPortOpen,
          homeFiles.includes("relaySMTP.exe") && !server.smtpPortOpen,
          homeFiles.includes("HTTPWorm.exe") && !server.httpPortOpen,
          homeFiles.includes("SQLInject.exe") && !server.sqlPortOpen,
        ].filter(Boolean).length >=
      (server.numOpenPortsRequired ?? 0)
    );
  });
};
