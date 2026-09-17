import { Cart } from "@/components/cart";
import { channelFrom } from "@/lib/commerce";
export const metadata = { title: "Tu bolsa" };
export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ modalidad?: string }>;
}) {
  return (
    <div className="container page-section">
      <p className="eyebrow">Un lugar para tus elegidos</p>
      <h1>Tu bolsa</h1>
      <Cart channel={channelFrom((await searchParams).modalidad)} />
    </div>
  );
}
