import { notFound } from "next/navigation";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { channelFrom } from "@/lib/commerce";
import { ProductPurchase } from "@/components/product-purchase";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await catalog.find((await params).slug);
  return { title: p?.name ?? "Artículo no encontrado" };
}
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
        <Link href={"/catalogo?modalidad=" + channel}>Catálogo</Link>
        <span>/</span>
        <Link
          href={
            "/catalogo?modalidad=" + channel + "&categoria=" + product.category
          }
        >
          Categoría
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <ProductPurchase
        key={product.id + channel}
        product={product}
        channel={channel}
      />
    </div>
  );
}
