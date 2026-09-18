import "server-only";
import data from "@/data/products.json";
import {
  catalogSchema,
  offers,
  availableUnits,
  type Product,
  type Channel,
} from "./commerce";
const products = catalogSchema.parse(data);
export interface CatalogRepository {
  list(query?: {
    channel?: Channel;
    category?: string;
    search?: string;
    available?: boolean;
    sort?: string;
  }): Promise<Product[]>;
  find(slug: string): Promise<Product | undefined>;
}
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const catalog: CatalogRepository = {
  async list(query = {}) {
    const result = products.filter(
      (p) =>
        p.active &&
        (!query.channel || offers(p, query.channel).length > 0) &&
        (!query.category || p.category === query.category) &&
        normalize(
          [p.name, p.description, p.sku, ...p.variants.map((v) => v.sku)].join(
            " ",
          ),
        ).includes(normalize(query.search ?? "")) &&
        (!query.available ||
          p.variants.some((v) =>
            (v.sales[query.channel ?? "minorista"] ?? []).some(
              (s) =>
                availableUnits(v, query.channel ?? "minorista") >=
                s.units * s.minQuantity,
            ),
          )),
    );
    const price = (p: Product) =>
      Math.min(...offers(p, query.channel ?? "minorista").map((s) => s.price));
    if (query.sort === "price-asc") result.sort((a, b) => price(a) - price(b));
    if (query.sort === "price-desc") result.sort((a, b) => price(b) - price(a));
    if (query.sort === "name")
      result.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return result;
  },
  async find(slug) {
    return products.find((p) => p.active && p.slug === slug);
  },
};
