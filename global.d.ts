import * as bitburner from "./NetscriptDefinitions";

export {};

declare global {
  interface NS extends bitburner.NS {
    scan(host?: Host): Host[];
  }

  type AutocompleteConfig = [string, string | number | boolean | string[]][];

  interface AutocompleteData {
    servers: string[];
    txts: string[];
    scripts: string[];
    flags: (config: AutocompleteConfig) => any;
  }
}
