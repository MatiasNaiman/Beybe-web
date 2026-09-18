import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductVisual } from "./product-visual";
import {
  offers,
  availableUnits,
  formatMoney,
  type Product,
  type Channel,
} from "@/lib/commerce";
export function ProductCard({
  product: p,
  channel,
  index = 0,
}: {
  product: Product;
  channel: Channel;
  index?: number;
}) {
  const sales = offers(p, channel),
    lowest = [...sales].sort((a, b) => a.price - b.price)[0];
  const available = p.variants.some((v) =>
    (v.sales[channel] ?? []).some(
      (s) => availableUnits(v, channel) >= s.minQuantity * s.units,
    ),
  );
  return (
    <Link
      className="product-card"
      href={"/producto/" + p.slug + "?modalidad=" + channel}
    >
      <div className="product-card-media">
        <ProductVisual
          image={p.images[0]}
          category={p.category}
          tone={index}
          label={p.name}
        />
        <div className="product-badges">
          {p.demo && <span className="badge">Demo</span>}
          {!available && <span className="badge neutral">Agotado</span>}
          {!p.retailEnabled && (
            <span className="badge neutral">Solo mayorista</span>
          )}
        </div>
        <span className="card-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="product-card-copy">
        <span className="product-code">{p.sku}</span>
        <h2>{p.name}</h2>
        <p className="card-price">
          Desde {formatMoney(lowest.price)}{" "}
          <span>/ {lowest.label.toLowerCase()}</span>
        </p>
        <p className="product-options">
          {p.variants.length > 1
            ? p.variants.length + " opciones"
            : "Opción única"}{" "}
          · {p.demo ? "Precio ficticio" : "ARS"}
        </p>
      </div>
    </Link>
  );
}
