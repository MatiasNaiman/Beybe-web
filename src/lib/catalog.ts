import "server-only";
import data from "@/data/products.json";
import { productSchema, type Product, type Channel } from "./commerce";
const products = productSchema.array().parse(data);
const unique = (items: string[]) => new Set(items).size === items.length;
if (
  !unique(products.map((p) => p.id)) ||
  !unique(products.map((p) => p.slug)) ||
  !unique(products.flatMap((p) => p.variants.map((v) => v.sku))) ||
  products.some((p) => !unique(p.variants.map((v) => v.id)))
)
  throw new Error("El catálogo contiene identificadores duplicados.");
export interface CatalogRepository {
  list(query?: {
    channel?: Channel;
    category?: string;
    search?: string;
  }): Promise<Product[]>;
  find(slug: string): Promise<Product | undefined>;
}
export const catalog: CatalogRepository = {
  async list(query = {}) {
    const search =
      query.search
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() ?? "";
    return products.filter(
      (p) =>
        (!query.channel || p.variants.some((v) => v.sales[query.channel!])) &&
        (!query.category || p.category === query.category) &&
        (p.name + " " + p.description)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(search),
    );
  },
  async find(slug) {
    return products.find((p) => p.slug === slug);
  },
};
