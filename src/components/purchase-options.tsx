"use client";
import {
  formatMoney,
  type Product,
  type Presentation,
  type Channel,
} from "@/lib/commerce";
type Variant = Product["variants"][number];
export function PurchaseOptions({
  variants,
  variant,
  sale,
  quantity,
  max,
  channel,
  onVariant,
  onPresentation,
  onQuantity,
}: {
  variants: Variant[];
  variant: Variant;
  sale: Presentation;
  quantity: number;
  max: number;
  channel: Channel;
  onVariant: (id: string) => void;
  onPresentation: (id: string) => void;
  onQuantity: (n: number) => void;
}) {
  return (
    <>
      {variants.length > 1 && (
        <fieldset className="variant-field">
          <legend>Elegí una opción</legend>
          <div className="variant-options">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === variant.id}
                onClick={() => onVariant(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <label className="field-label" htmlFor="presentation">
        Presentación
      </label>
      <select
        id="presentation"
        value={sale.id}
        onChange={(e) => onPresentation(e.target.value)}
      >
        {variant.sales[channel]!.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label} · {formatMoney(s.price)}
          </option>
        ))}
      </select>
      <div className="purchase-quantity">
        <div>
          <label className="field-label" htmlFor="quantity">
            Cantidad de presentaciones
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            min={sale.minQuantity}
            max={max}
            step={sale.step}
            onChange={(e) => onQuantity(Number(e.target.value))}
          />
        </div>
        <p>
          {quantity * sale.units}{" "}
          {quantity * sale.units === 1 ? "unidad" : "unidades"} en total
          <br />
          <span className="muted">
            Mínimo {sale.minQuantity} · incrementos de {sale.step}
          </span>
        </p>
      </div>
    </>
  );
}
