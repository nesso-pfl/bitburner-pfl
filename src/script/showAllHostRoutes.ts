import { getAllHostRoutes } from "/lib/host/getAllHostRoutes";

export async function main(ns: NS): Promise<void> {
  ns.tprint(getAllHostRoutes(ns));
}
