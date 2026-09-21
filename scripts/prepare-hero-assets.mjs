import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "public/hero");
await fs.mkdir(target, { recursive: true });
for (const [name, original, widths] of [
  ["bebe-desktop", "fotoBebeAcostada.jpg", [960, 1440, 1672]],
  ["bebe-mobile", "fotoBebeMovil.jpg", [480, 768, 941]],
]) {
  for (const width of widths) {
    const destination = path.join(target, `${name}-${width}.webp`);
    await sharp(path.join(root, "../sources", original))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 92, effort: 6 })
      .toFile(destination);
    console.log(path.basename(destination), (await fs.stat(destination)).size);
  }
}
// The first five closed subpaths are the original butterfly and its four holes.
// Copy path data byte-for-byte; never trace, simplify or reshape the mark.
const logo = await fs.readFile(
  path.join(root, "public/brand/logo.svg"),
  "utf8",
);
const data = logo.match(/ d="([^"]+)"/)[1];
const boundary = " M886.95 195.7";
if (!data.includes(boundary))
  throw new Error("Logo changed: inspect subpaths before extracting.");
const butterfly = data.slice(0, data.indexOf(boundary));
if ((butterfly.match(/M/g) ?? []).length !== 5)
  throw new Error("Unexpected butterfly subpaths.");
await fs.writeFile(
  path.join(root, "public/brand/butterfly.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="353 3 276 226"><title>Mariposa BEYBE</title><path fill="#89c1a8" fill-rule="evenodd" d="${butterfly}"/></svg>\n`,
);
console.log("Butterfly extracted with unchanged path geometry.");
