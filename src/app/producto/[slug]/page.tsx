import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { channelFrom } from "@/lib/commerce";
import { ProductPurchase } from "@/components/product-purchase";
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ modalidad?: string }>;
}) {
  const product = await catalog.find((await params).slug);
  if (!product) notFound();
  const channel = channelFrom((await searchParams).modalidad);
  return (
    <div className="container page-section">
      <div className="breadcrumb">
        <Link href={`/catalogo?modalidad=${channel}`}>Catálogo</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          {product.images.map((im, i) => (
            <Image
              key={im.src}
              src={im.src}
              alt={im.alt}
              width={900}
              height={1000}
              priority={i === 0}
            />
          ))}
        </div>
        <div>
          <p className="eyebrow">BEYBE · Fabricación propia</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          <ProductPurchase product={product} channel={channel} />
          <p className="muted">
            Modalidad {channel}. Precios en pesos argentinos. Envío y forma de
            pago a confirmar.
          </p>
        </div>
      </div>
    </div>
  );
}
