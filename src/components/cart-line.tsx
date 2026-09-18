"use client";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { ProductVisual } from "./product-visual";
import { useShop } from "./shop-provider";
import {
  formatMoney,
  type CartLine as Line,
  type Channel,
  type Quote,
} from "@/lib/commerce";
export function CartLine({
  line,
  item,
  channel,
}: {
  line: Line;
  item?: Quote["items"][number];
  channel: Channel;
}) {
  const { setQuantity, remove } = useShop();
  return (
    <article className="cart-item">
      {item && (
        <Link
          className="cart-thumb"
          href={"/producto/" + item.slug + "?modalidad=" + channel}
          aria-label={"Ver " + item.name}
        >
          <ProductVisual image={item.image} category={item.category} />
        </Link>
      )}
      <div className="cart-item-copy">
        <h2>{item?.name ?? "Artículo a revisar"}</h2>
        <p>
          {item
            ? item.label + " · " + item.presentation
            : "Ya no está disponible con esta modalidad."}
        </p>
        {item && (
          <>
            <p className="product-code">
              {item.sku}
              {item.demo ? " · Demo" : ""}
            </p>
            <p>{formatMoney(item.price)} por presentación</p>
            <div className="quantity-control">
              <button
                aria-label={"Reducir cantidad de " + item.name}
                disabled={line.quantity <= item.minQuantity}
                onClick={() =>
                  setQuantity(channel, {
                    ...line,
                    quantity: Math.max(
                      item.minQuantity,
                      line.quantity - item.step,
                    ),
                  })
                }
              >
                <Minus size={16} />
              </button>
              <label
                className="sr-only"
                htmlFor={
                  "qty-" + item.productId + item.variantId + item.presentationId
                }
              >
                Cantidad de {item.name} · {item.presentation}
              </label>
              <input
                id={
                  "qty-" + item.productId + item.variantId + item.presentationId
                }
                type="number"
                value={line.quantity}
                min={item.minQuantity}
                max={item.stock}
                step={item.step}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n > 0 && n <= 999)
                    setQuantity(channel, { ...line, quantity: n });
                }}
              />
              <button
                aria-label={"Aumentar cantidad de " + item.name}
                disabled={line.quantity + item.step > item.stock}
                onClick={() =>
                  setQuantity(channel, {
                    ...line,
                    quantity: line.quantity + item.step,
                  })
                }
              >
                <Plus size={16} />
              </button>
            </div>
            <small>{line.quantity * item.units} unidades en total</small>
          </>
        )}
      </div>
      <div className="cart-item-end">
        {item && <strong>{formatMoney(item.total)}</strong>}
        <button
          className="icon-button"
          aria-label={"Eliminar " + (item?.name ?? "artículo")}
          onClick={() => remove(channel, line)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
