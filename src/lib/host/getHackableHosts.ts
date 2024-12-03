import { getAllHosts } from "/lib/host/getAllHosts";

export const getHackableHosts = (ns: NS) => {
  return getAllHosts(ns).filter((host) => ns.getServer(host).hasAdminRights);
};
