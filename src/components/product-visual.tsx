import Image from "next/image";
import { Shirt, Layers, Droplets, Flower2, Heart, Baby } from "lucide-react";
import type { Product } from "@/lib/commerce";
const icons = {
  ajuar: Baby,
  ropa: Shirt,
  bano: Droplets,
  mantillas: Layers,
  baberos: Heart,
  gorritos: Flower2,
};
export function ProductVisual({
  image,
  category,
  label = "Fotografía pendiente",
  tone = 0,
  priority = false,
  sizes = "(max-width:389px) 90vw, (max-width:1023px) 45vw, 30vw",
}: {
  image?: Product["images"][number] | null;
  category: Product["category"];
  label?: string;
  tone?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const Icon = icons[category];
  return image ? (
    <div className="product-art real-photo">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
      />
    </div>
  ) : (
    <div
      className={"product-art placeholder-art tone-" + (tone % 3)}
      role="img"
      aria-label={
        label + "; ilustración de categoría, no fotografía de un producto"
      }
    >
      <div className="art-orbit" />
      <div className="art-stitch" />
      <Icon className="art-symbol" strokeWidth={0.7} aria-hidden="true" />
      <span className="art-caption">Fotografía pendiente</span>
      <span className="art-stamp" aria-hidden="true">
        pequeños detalles
      </span>
    </div>
  );
}
