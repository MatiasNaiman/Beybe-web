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
              sizes={
                index === 0 || index === categories.length - 1
                  ? "(max-width: 767px) 90vw, 30vw"
                  : "(max-width: 767px) 44vw, 30vw"
              }
            />
            <span className="reference-label">Imagen de referencia</span>
          </div>
          <div className="category-copy">
            <span className="category-arrow" aria-hidden="true">
              ↗
            </span>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
