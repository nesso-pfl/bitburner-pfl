import { getAllHosts } from "/lib/host/getAllHosts";

const blacklist = ["darkweb", "w0r1d_d43m0n"];

export const getHackableHosts = (ns: NS) => {
  return getAllHosts(ns).filter((host) => ns.getServer(host).hasAdminRights && !blacklist.includes(host));
};
