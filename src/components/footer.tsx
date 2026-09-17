import Link from "next/link";
import { Brand } from "./brand";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" aria-label="BEYBE · Inicio">
              <Brand />
            </Link>
            <p>Pequeños comienzos. Mucho amor.</p>
          </div>
          <nav aria-label="Explorá">
            <h2>Explorá</h2>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/mayoristas">Mayoristas</Link>
            <Link href="/nosotros">Nuestra historia</Link>
          </nav>
          <nav aria-label="Te acompañamos">
            <h2>Te acompañamos</h2>
            <Link href="/ayuda#contacto">Contacto</Link>
            <Link href="/ayuda">Cómo comprar</Link>
            <Link href="/ayuda#cambios">Cambios y devoluciones</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>BEYBE · Fabricación propia</span>
          <span>Precios expresados en pesos argentinos.</span>
          <Link href="/creditos">Imágenes de referencia</Link>
        </div>
      </div>
    </footer>
  );
}
