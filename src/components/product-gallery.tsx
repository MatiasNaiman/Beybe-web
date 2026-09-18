"use client";
import { useState } from "react";
import { ProductVisual } from "./product-visual";
import type { Product } from "@/lib/commerce";
export function ProductGallery({
  product: p,
  variantId,
}: {
  product: Product;
  variantId: string;
}) {
  const [imageIndex, setImageIndex] = useState(0),
    variant = p.variants.find((v) => v.id === variantId);
  return (
    <div className="product-gallery">
      <div className="gallery-stage" key={variantId + imageIndex}>
        <ProductVisual
          image={p.images[imageIndex]}
          category={p.category}
          tone={p.variants.findIndex((v) => v.id === variantId)}
          label={p.name + " · " + (variant?.label ?? "")}
          priority
        />
      </div>
      {p.images.length > 1 && (
        <div className="gallery-thumbnails">
          {p.images.map((im, i) => (
            <button
              key={im.src}
              aria-label={"Ver imagen " + (i + 1)}
              aria-pressed={i === imageIndex}
              onClick={() => setImageIndex(i)}
            >
              <ProductVisual image={im} category={p.category} />
            </button>
          ))}
        </div>
      )}
      <p className="fine-print">
        {p.demo
          ? "Producto ficticio para probar la tienda. La ilustración no representa un artículo BEYBE."
          : p.images.length
            ? "Las imágenes corresponden al artículo seleccionado."
            : "Fotografía pendiente."}
      </p>
    </div>
  );
}
