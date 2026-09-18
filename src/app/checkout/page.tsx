import { CheckoutPreview } from "@/components/checkout-preview";
export const metadata = { title: "Revisar pedido" };
export default function CheckoutPage() {
  return (
    <div className="container page-section">
      <p className="eyebrow">Un paso más cerca</p>
      <h1>Revisá tu pedido.</h1>
      <CheckoutPreview />
    </div>
  );
}
