import Link from "next/link";
import { Brand } from "@/components/brand";
export const metadata = { title: "Nuestra historia" };
export default function About() {
  return (
    <div className="container page-section about-page">
      <div>
        <p className="eyebrow">Nuestra historia</p>
        <h1>Desde 1998, parte de sus primeros días.</h1>
        <p className="lead">Somos fabricantes. Hacemos BEYBE.</p>
        <p>
          Diseñamos y fabricamos ropa y accesorios para bebés. Acompañamos a las
          familias con prendas y pequeños detalles hechos por nosotros.
        </p>
        <p>
          Vendemos de forma minorista y mayorista, para estar cerca de cada
          nueva historia y de los negocios que eligen crecer con BEYBE.
        </p>
        <Link href="/catalogo" className="button">
          Conocé nuestras categorías
        </Link>
      </div>
      <div className="about-brand">
        <Brand hero />
        <p>Pequeños comienzos. Mucho amor.</p>
      </div>
    </div>
  );
}
