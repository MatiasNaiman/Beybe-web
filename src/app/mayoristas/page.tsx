import Link from "next/link";
import { CategoryGrid } from "@/components/category-grid";
import { WholesaleBanner } from "@/components/wholesale-banner";
export const metadata = { title: "Venta mayorista" };
export default function Wholesale() {
  return (
    <div className="container page-section">
      <WholesaleBanner catalogLink />
      <div className="wholesale-steps">
        <div>
          <span className="eyebrow">01 · Elegí</span>
          <h2>Descubrí las categorías.</h2>
          <p>Prendas y accesorios de fabricación propia para tu negocio.</p>
        </div>
        <div>
          <span className="eyebrow">02 · Armá tu selección</span>
          <h2>Desde $150.000.</h2>
          <p>
            La bolsa mayorista reúne las variantes y cantidades de tu pedido.
          </p>
        </div>
        <div>
          <span className="eyebrow">03 · Conversemos</span>
          <h2>Confirmamos juntos.</h2>
          <p>
            La disponibilidad, el envío y la forma de pago se coordinan por
            WhatsApp antes de confirmar.
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Fabricación propia desde 1998</p>
          <h1>Un mundo de pequeños detalles.</h1>
        </div>
        <Link className="text-link" href="/catalogo?modalidad=mayorista">
          Ver catálogo mayorista →
        </Link>
      </div>
      <CategoryGrid channel="mayorista" />
      <p className="image-note">
        Imágenes provisionales de referencia. El catálogo comercial está en
        preparación.
      </p>
    </div>
  );
}
