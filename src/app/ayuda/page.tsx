import Link from "next/link";
import { whatsappUrl } from "@/lib/commerce";
import { whatsappNumber } from "@/lib/store-config";
export const metadata = { title: "Cómo comprar" };
export default function Help() {
  const contact = whatsappUrl(
    whatsappNumber,
    "Hola BEYBE, quisiera hacer una consulta.",
  );
  return (
    <div className="container page-section prose">
      <p className="eyebrow">Te acompañamos</p>
      <h1>Comprar, con tranquilidad.</h1>
      <p className="lead">
        Podés recorrer la tienda y probar sus bolsas. La compra real y los
        cobros todavía no están habilitados.
      </p>
      <section>
        <h2>Para tu bebé</h2>
        <p>
          La compra minorista tiene un mínimo de $50.000. Elegí las variantes y
          presentaciones disponibles y reuní tus artículos en la bolsa.
        </p>
      </section>
      <section>
        <h2>Para tu negocio</h2>
        <p>
          El pedido mayorista tiene un mínimo de $150.000. La selección abre un
          borrador en WhatsApp para consultar disponibilidad, envío y pago. Los
          artículos demostrativos generan un borrador de prueba claramente
          identificado.
        </p>
        <Link className="text-link" href="/mayoristas">
          Conocé la venta mayorista →
        </Link>
      </section>
      <section>
        <h2>Formas de pago y envíos</h2>
        <p>
          Estamos preparando Mercado Pago, transferencia bancaria y efectivo,
          sujetos a validación según la modalidad. Todavía no se reciben pagos
          en esta web.
        </p>
        <p>
          Las opciones de envío, sus costos y los plazos estarán informados
          antes de confirmar una compra.
        </p>
      </section>
      <section id="cambios">
        <h2>Cambios y devoluciones</h2>
        <p>
          Publicaremos las condiciones completas antes de habilitar la tienda.
          Por ahora no se confirman compras ni se reciben pagos online.
        </p>
      </section>
      <section id="contacto">
        <h2>Hablemos</h2>
        {contact ? (
          <a
            className="button"
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp ↗
          </a>
        ) : (
          <p>
            El canal de contacto comercial estará disponible junto con la
            apertura del catálogo.
          </p>
        )}
      </section>
    </div>
  );
}
