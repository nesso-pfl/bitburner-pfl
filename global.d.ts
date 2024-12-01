import * as bitburner from "./NetscriptDefinitions";

export {};

declare global {
  interface NS extends bitburner.NS {
    getGrowTime(host: Host): number;
    getHackTime(host: Host): number;
    getPurchasedServers(): Tera[];
    getServer(host?: Host): bitburner.Server;
    getServerGrowth(host: Host): number;
    getServerMaxMoney(host: Host): number;
    getServerMaxRam(host: Host | Tera): number;
    getServerMinSecurityLevel(host: Host): number;
    getServerMoneyAvailable(host: Host): number;
    getServerSecurityLevel(host: Host): number;
    getWeakenTime(host: Host): number;
    grow(host: Host, opts?: bitburner.BasicHGWOptions): Promise<number>;
    growthAnalyze(host: Host, multiplier: number, cores?: number): number;
    growthAnalyzeSecurity(threads: number, hostname?: Host, cores?: number): number;
    hackAnalyze(host: Host): number;
    hackAnalyzeChance(host: Host): number;
    hackAnalyzeThreads(host: Host, hackAmount: number): number;
    ls(host: Host | Tera, substring?: string): string[];
    purchaseServer(hostname: Tera, ram: number): Tera;
    scan(host?: Host | Tera): (Host | Tera)[];
    scp(files: string | string[], destination: Host | Tera, source?: Host | Tera): boolean;
    upgradePurchasedServer(hostname: Tera, ram: number): boolean;
    weaken(host: Host, opts?: bitburner.BasicHGWOptions): Promise<number>;
  }

  type AutocompleteConfig = [string, string | number | boolean | string[]][];

  interface AutocompleteData {
    servers: string[];
    txts: string[];
    scripts: string[];
    flags: (config: AutocompleteConfig) => any;
  }
}
