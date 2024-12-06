export const nuke = (ns: NS, host: Host) => {
  const server = ns.getServer(host);
  const homeFiles = ns.ls('home');
  if (homeFiles.includes('BruteSSH.exe') && !server.sshPortOpen) ns.brutessh(host);
  if (homeFiles.includes('FTPCrack.exe') && !server.ftpPortOpen) ns.ftpcrack(host);
  if (homeFiles.includes('relaySMTP.exe') && !server.smtpPortOpen) ns.relaysmtp(host);
  if (homeFiles.includes('HTTPWorm.exe') && !server.httpPortOpen) ns.httpworm(host);
  if (homeFiles.includes('SQLInject.exe') && !server.sqlPortOpen) ns.sqlinject(host);
  ns.nuke(host);
};
