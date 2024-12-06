import { getAllHostRoutes } from '/lib/host/getAllHostRoutes';
import { nub } from '/util/nub';

export const getAllHosts = (ns: NS) => {
  return nub(
    getAllHostRoutes(ns)
      .flat()
      .filter((host) => !host.startsWith('tera')),
  );
};
