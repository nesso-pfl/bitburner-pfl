import { watch, readdirSync, Dirent, writeFileSync } from "fs";

const filePath = "src/lib/typedPath.ts";
console.log("hai");

watch("./src", { recursive: true }, (_, filename) => {
  if (filename === "/lib/typedPath.ts") return;

  const content = getAllFiles();
  writeFileSync(filePath, content);
  console.log(`Typed-path file updated in ${filePath}.`);
});

const getAllFiles = (dirPath = "src", indent = "  ") => {
  const head = dirPath === "src" ? "export const filePath = {" : `${dirPath.split("/").at(-1)}: {`;
  const files = readdirSync(dirPath, { withFileTypes: true, recursive: true })
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .flatMap((dirEnt) => showFile(dirEnt, dirPath, indent));

  return `${indent.slice(2)}${head}
${files.join("\n")}
${indent.slice(2)}}${dirPath === "src" ? "" : ","}`;
};

const showFile = (dirEnt: Dirent, dirPath: string, indent: string) => {
  const head = `${indent}${dirEnt.name.split(".")[0]}: {`;
  const foot = `${indent}},`;
  const $path = `${indent}  $path: '${dirPath.slice(4)}/${dirEnt.name.replace(".ts", ".js")}' as const,`;

  return dirEnt.isDirectory()
    ? getAllFiles(`${dirPath}/${dirEnt.name}`, indent + "  ")
    : [
        `${head}
${$path}
${foot}`,
      ];
};
