"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductVisual } from "./product-visual";
import type { Product } from "@/lib/commerce";
export function ProductGallery({
  product: p,
  variantId,
}: {
  product: Product;
  variantId: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const images = p.images.length ? p.images : [null];
  const move = (i: number) => {
    const el = viewport.current;
    if (el)
      el.scrollTo({
        left: el.clientWidth * i,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  };
  return (
    <div className="product-gallery">
      <div
        className="gallery-viewport"
        ref={viewport}
        aria-label="Imágenes del artículo"
        tabIndex={images.length > 1 ? 0 : undefined}
        onScroll={(e) =>
          setIndex(
            Math.round(
              e.currentTarget.scrollLeft / e.currentTarget.clientWidth,
            ),
          )
        }
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            move(
              Math.max(
                0,
                Math.min(
                  images.length - 1,
                  index + (e.key === "ArrowRight" ? 1 : -1),
                ),
              ),
            );
          }
        }}
      >
        {images.map((im, i) => (
          <div className="gallery-slide" key={im?.src ?? "placeholder"}>
            <ProductVisual
              image={im}
              category={p.category}
              tone={p.variants.findIndex((v) => v.id === variantId)}
              label={
                p.name +
                " · " +
                (p.variants.find((v) => v.id === variantId)?.label ?? "")
              }
              priority={i === 0}
              sizes="(max-width:767px) 90vw, 45vw"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="gallery-controls">
            <p aria-live="polite">
              {index + 1} / {images.length}
            </p>
            <div>
              <button
                className="icon-button"
                disabled={index === 0}
                aria-label="Imagen anterior"
                onClick={() => move(index - 1)}
              >
                <ChevronLeft />
              </button>
              <button
                className="icon-button"
                disabled={index === images.length - 1}
                aria-label="Imagen siguiente"
                onClick={() => move(index + 1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="gallery-thumbnails">
            {images.map((im, i) => (
              <button
                key={im!.src}
                aria-label={"Ver imagen " + (i + 1)}
                aria-pressed={index === i}
                onClick={() => move(i)}
              >
                <ProductVisual image={im} category={p.category} sizes="52px" />
              </button>
            ))}
          </div>
        </>
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
