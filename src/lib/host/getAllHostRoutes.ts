import { nub } from "/util/nub";

type Route = Host[];

export const getAllHostRoutes = (ns: NS) => {
  return getNewRoutes([["home"]], ns);
};

const getNewRoutes = (routes: Route[], ns: NS): Route[] => {
  const allHosts = nub(routes.flat());
  const newRoutes = routes.flatMap((route) => {
    const newRoutes_ = ns.scan(route.at(-1)).filter((host) => !allHosts.includes(host));
    return newRoutes_.map((host) => [...route, host]);
  });

  return newRoutes.length === 0 ? routes : [...routes, ...getNewRoutes(newRoutes, ns)];
};
