import Link from "next/link";
import { whatsappUrl } from "@/lib/commerce";
export const metadata = { title: "Cómo comprar" };
export default function Help() {
  const contact = whatsappUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    "Hola BEYBE, quisiera hacer una consulta.",
  );
  return (
    <div className="container page-section prose">
      <p className="eyebrow">Te acompañamos</p>
      <h1>Comprar, con tranquilidad.</h1>
      <p className="lead">
        Estamos preparando nuestra tienda online. Acá podés conocer cómo va a
        funcionar.
      </p>
      <section>
        <h2>Para tu bebé</h2>
        <p>
          La compra minorista tendrá un mínimo de $50.000. Podrás elegir las
          variantes disponibles y reunir tus artículos en la bolsa.
        </p>
      </section>
      <section>
        <h2>Para tu negocio</h2>
        <p>
          El pedido mayorista tendrá un mínimo de $150.000. La selección se
          enviará por WhatsApp para confirmar disponibilidad y coordinar la
          compra.
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
