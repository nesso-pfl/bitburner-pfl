const hosts = [
  "home",
  "n00dles",
  "foodnstuff",
  "sigma-cosmetics",
  "joesguns",
  "hong-fang-tea",
  "harakiri-sushi",
  "iron-gym",
  "nectar-net",
  "CSEC",
  "max-hardware",
  "zer0",
  "neo-net",
  "silver-helix",
  "phantasy",
  "omega-net",
  "netlink",
  "computek",
  "the-hub",
  "johnson-ortho",
  "crush-fitness",
  "avmnite-02h",
  "zb-institute",
  "I.I.I.I",
  "syscore",
  "catalyst",
  "rothman-uni",
  "summit-uni",
  "lexo-corp",
  "rho-construction",
  "aevum-police",
  "alpha-ent",
  "millenium-fitness",
  "aerocorp",
  "snap-fitness",
  "galactic-cyber",
  "global-pharm",
  "omnia",
  "deltaone",
  "unitalife",
  "defcomm",
  "icarus",
  "solaris",
  "univ-energy",
  "zeus-med",
  "infocomm",
  "taiyang-digital",
  "zb-def",
  "nova-med",
  "microdyne",
  "titan-labs",
  "applied-energetics",
  "run4theh111z",
  "fulcrumtech",
  "vitalife",
  "stormtech",
  "helios",
  "4sigma",
  "kuai-gong",
  "omnitek",
  ".",
  "blade",
  "nwo",
  "b-and-a",
  "clarkinc",
  "powerhouse-fitness",
  "The-Cave",
  "ecorp",
  "megacorp",
  "fulcrumassets",
] satisfies Host[];

export const toHost = (host: string): Host => {
  const value = hosts.find((host_) => host_ === host);
  if (value) {
    return value;
  } else {
    throw new Error(`Invalid host: ${host}`);
  }
};