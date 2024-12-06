export const copyScripts = (ns: NS, dest: Host | Tera) => {
  ns.scp(
    ns.ls('home').filter((file) => file.endsWith('js')),
    dest,
    'home',
  );
};
