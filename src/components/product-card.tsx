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
  layout = "standard",
}: {
  product: Product;
  channel: Channel;
  index?: number;
  layout?: "standard" | "featured-lead" | "featured-secondary";
}) {
  const editorial = layout !== "standard";
  const sales = offers(p, channel),
    lowest = [...sales].sort((a, b) => a.price - b.price)[0];
  const available = p.variants.some((v) =>
    (v.sales[channel] ?? []).some(
      (s) => availableUnits(v, channel) >= s.minQuantity * s.units,
    ),
  );
  return (
    <Link
      className={
        "product-card" +
        (editorial ? ` featured-product featured-product--${layout}` : "")
      }
      href={"/producto/" + p.slug + "?modalidad=" + channel}
    >
      <div className="product-card-media">
        <ProductVisual
          image={p.images[0]}
          category={p.category}
          tone={index}
          label={p.name}
          sizes={
            layout === "featured-lead"
              ? "(max-width: 767px) calc(100vw - 40px), 58vw"
              : layout === "featured-secondary"
                ? "(max-width: 767px) 38vw, 18vw"
                : undefined
          }
        />
        {!editorial && (
          <>
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
          </>
        )}
      </div>
      {editorial && p.demo && (
        <span className="featured-visual-note">Visual demostrativo</span>
      )}
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
