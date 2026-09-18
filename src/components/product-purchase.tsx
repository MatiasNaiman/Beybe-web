"use client";
import Link from "next/link";
import { ShoppingBag, Check, ArrowRight, ChevronDown } from "lucide-react";
import {
  formatMoney,
  offers,
  type Product,
  type Channel,
} from "@/lib/commerce";
import { ProductGallery } from "./product-gallery";
import { PurchaseOptions } from "./purchase-options";
import { useProductSelection } from "./use-product-selection";
export function ProductPurchase({
  product: p,
  channel,
}: {
  product: Product;
  channel: Channel;
}) {
  const s = useProductSelection(p, channel),
    { variant, sale } = s;
  return (
    <div className="product-detail">
      <ProductGallery key={s.variantId} product={p} variantId={s.variantId} />
      <div className="purchase-panel">
        <p className="eyebrow">
          {p.demo ? "Colección demostrativa" : "BEYBE · Vistiendo al futuro"}
        </p>
        <h1>{p.name}</h1>
        {sale && (
          <div className="purchase-price">
            {formatMoney(sale.price)}
            <span> / {sale.label.toLowerCase()}</span>
          </div>
        )}
        <p className="product-code">Código {p.sku}</p>
        <nav className="segmented" aria-label="Modalidad de este producto">
          {(["minorista", "mayorista"] as const).map((c) => (
            <Link
              key={c}
              href={"/producto/" + p.slug + "?modalidad=" + c}
              aria-current={c === channel ? "page" : undefined}
            >
              {c === "minorista" ? "Para mi bebé" : "Para mi negocio"}
            </Link>
          ))}
        </nav>
        {!offers(p, channel).length ? (
          <div className="notice">
            <h2>No disponible en esta modalidad</h2>
            <p>Consultá las presentaciones del otro canal.</p>
            <Link
              className="button"
              href={
                "/producto/" +
                p.slug +
                "?modalidad=" +
                (channel === "minorista" ? "mayorista" : "minorista")
              }
            >
              Ver otras presentaciones
            </Link>
          </div>
        ) : (
          variant &&
          sale && (
            <>
              <p className="fine-print">
                {p.demo ? "Precio ficticio de prueba. " : ""}
                {sale.units} {sale.units === 1 ? "unidad" : "unidades"} por
                presentación.
              </p>
              <PurchaseOptions
                variants={s.variants}
                variant={variant}
                sale={sale}
                quantity={s.quantity}
                max={s.max}
                channel={channel}
                onVariant={s.chooseVariant}
                onPresentation={s.choosePresentation}
                onQuantity={s.changeQuantity}
              />
              <p className={"availability " + (s.max === 0 ? "sold-out" : "")}>
                {s.max === 0
                  ? "Sin disponibilidad"
                  : variant.availability === "on_request"
                    ? "Disponibilidad a confirmar"
                    : "Disponible" + (p.demo ? " en el ejemplo" : "")}{" "}
                · SKU {variant.sku}
              </p>
              {s.check.errors.length > 0 && s.max > 0 && (
                <p role="status" className="validation-message">
                  {s.check.errors[0]}
                </p>
              )}
              {!s.cartHasRoom && (
                <p role="status">
                  Tu bolsa alcanzó el máximo de 250 combinaciones. Eliminá una
                  para continuar.
                </p>
              )}
              <button
                className="button add-button"
                disabled={!s.valid || s.max === 0}
                onClick={s.addToCart}
              >
                {s.added ? <Check size={19} /> : <ShoppingBag size={19} />}{" "}
                {s.max === 0
                  ? "Agotado"
                  : s.added
                    ? "Agregar otra vez"
                    : "Agregar a mi bolsa"}
              </button>
              {s.added && (
                <Link
                  className="added-link"
                  href={"/bolsa?modalidad=" + channel}
                >
                  Ver mi bolsa {channel} <ArrowRight size={17} />
                </Link>
              )}
              <div className="purchase-notes">
                <p>Precios en ARS. Envío y disponibilidad final a confirmar.</p>
                <p>
                  {channel === "mayorista"
                    ? "Tu selección se consulta por WhatsApp. El negocio confirma el pedido."
                    : "Compra mínima $50.000. Los cobros todavía no están habilitados."}
                </p>
              </div>
            </>
          )
        )}
        <details className="purchase-details">
          <summary>
            Sobre este artículo <ChevronDown size={18} />
          </summary>
          <p>{p.description}</p>
        </details>
      </div>
    </div>
  );
}
