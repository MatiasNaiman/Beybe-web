import {
  readFile,
  writeFile,
  copyFile,
  rename,
  mkdir,
  access,
} from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { catalogSchema } from "../src/lib/commerce";
async function main() {
  const file = process.argv[2],
    apply = process.argv.includes("--apply");
  if (!file)
    throw new Error("Uso: pnpm catalog:validate archivo.json [--apply]");
  const root = resolve(dirname(resolve(process.argv[1])), ".."),
    target = resolve(root, "src/data/products.json");
  const input = catalogSchema.parse(
    JSON.parse(await readFile(resolve(file), "utf8")),
  );
  for (const p of input)
    for (const image of p.images) {
      const asset = resolve(root, "public", "." + image.src);
      if (relative(resolve(root, "public/products"), asset).startsWith(".."))
        throw new Error("Imagen fuera de products.");
      await access(asset);
    }
  console.log(
    input.length +
      " artículos válidos. " +
      (input.some((p) => p.demo) ? "DEMOSTRATIVOS" : "Catálogo real") +
      "; no se activarán pagos.",
  );
  if (apply) {
    const backup = resolve(root, ".catalog-backups", Date.now() + ".json");
    await mkdir(dirname(backup), { recursive: true });
    await copyFile(target, backup);
    const temporary = target + ".tmp";
    await writeFile(temporary, JSON.stringify(input, null, 2) + "\n", "utf8");
    await rename(temporary, target);
    console.log(
      "Catálogo importado. Respaldo: " +
        backup +
        ". Reiniciá desarrollo o recompilá para aplicar.",
    );
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
