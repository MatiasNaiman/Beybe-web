"use client";
import { useState } from "react";
import Link from "next/link";
import { useShop } from "./shop-provider";
import { formatMoney, type Product, type Channel } from "@/lib/commerce";
export function ProductPurchase({
  product,
  channel,
}: {
  product: Product;
  channel: Channel;
}) {
  const options = product.variants.filter((v) => v.sales[channel]);
  const [variantId, setVariantId] = useState(options[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const { carts, setQuantity, ready } = useShop();
  const variant = options.find((v) => v.id === variantId);
  const sale = variant?.sales[channel];
  if (!variant || !sale)
    return <p>Este artículo no está disponible en esta modalidad.</p>;
  const current =
    carts[channel].find(
      (i) => i.productId === product.id && i.variantId === variant.id,
    )?.quantity ?? 0;
  const nextQuantity = current ? current + sale.step : sale.minQuantity;
  return (
    <div className="purchase-panel">
      <p className="product-price">
        {formatMoney(sale.price)} <small>por unidad</small>
      </p>
      <label htmlFor="variant">Elegí una variante</label>
      <select
        id="variant"
        value={variantId}
        onChange={(e) => {
          setVariantId(e.target.value);
          setAdded(false);
        }}
      >
        {options.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
            {v.stock === 0 ? " · Sin stock" : ""}
          </option>
        ))}
      </select>
      <p className="muted">
        Mínimo {sale.minQuantity} unidad{sale.minQuantity > 1 ? "es" : ""}.
        Incrementos de {sale.step}.
      </p>
      <button
        className="button"
        disabled={!ready || nextQuantity > variant.stock}
        onClick={() => {
          setQuantity(channel, {
            productId: product.id,
            variantId: variant.id,
            quantity: nextQuantity,
          });
          setAdded(true);
        }}
      >
        {variant.stock === 0
          ? "Sin stock"
          : nextQuantity > variant.stock
            ? "Máximo disponible en tu bolsa"
            : "Agregar a mi bolsa"}
      </button>
      <p role="status">
        {added && (
          <>
            Agregado a tu bolsa.{" "}
            <Link className="text-link" href={`/bolsa?modalidad=${channel}`}>
              Ver pedido →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
