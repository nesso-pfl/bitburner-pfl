import { getHackableHosts } from '/lib/host/getHackableHosts';

export const getHostFiles = (ns: NS) => {
  getHackableHosts(ns).map((host) => ns.scp(ns.ls(host), 'home', host));
};
