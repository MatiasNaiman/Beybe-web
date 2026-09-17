import { categories } from "@/data/categories";
import sources from "@/data/image-sources.json";
export const metadata = { title: "Imágenes de referencia" };
export default function Credits() {
  return (
    <div className="container page-section prose">
      <p className="eyebrow">Sobre estas imágenes</p>
      <h1>Una primera mirada.</h1>
      <p className="lead">
        Las imágenes de las categorías son referencias visuales provisionales.
        No muestran productos BEYBE a la venta.
      </p>
      <p>
        Proceden de StockCake y fueron creadas con inteligencia artificial.
        StockCake las ofrece bajo CC0, con uso comercial permitido. Serán
        reemplazadas por las fotografías definitivas de nuestro catálogo.
      </p>
      <p>
        <a
          className="text-link"
          href="https://stockcake.com/info/license"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar licencia de StockCake ↗
        </a>
      </p>
      <ul className="credits-list">
        {sources.map((source) => (
          <li key={source.slug}>
            <a href={source.page} target="_blank" rel="noopener noreferrer">
              {categories.find((c) => c.id === source.slug)?.name ??
                source.slug}{" "}
              · Fuente original ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
