export const nuke = (ns: NS, host: Host) => {
  const server = ns.getServer(host);
  if (!server.httpPortOpen) ns.httpworm(host);
  if (!server.ftpPortOpen) ns.ftpcrack(host);
  if (!server.sqlPortOpen) ns.sqlinject(host);
  if (!server.sshPortOpen) ns.brutessh(host);
  if (!server.smtpPortOpen) ns.relaysmtp(host);
  ns.nuke(host);
};
