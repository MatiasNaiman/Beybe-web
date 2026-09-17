import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import type { Channel } from "@/lib/commerce";
export function CategoryGrid({ channel = "minorista" }: { channel?: Channel }) {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <Link
          className="category-card"
          key={category.id}
          href={`/catalogo?categoria=${category.id}&modalidad=${channel}`}
        >
          <div className="category-image">
            <Image
              src={category.image}
              alt={category.alt}
              fill
              sizes="(max-width: 600px) 40vw, (max-width: 1000px) 46vw, 30vw"
            />
            <span className="reference-label">Imagen de referencia</span>
          </div>
          <div className="category-copy">
            <div className="category-index">
              <span>0{index + 1}</span>
              <span className="category-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
