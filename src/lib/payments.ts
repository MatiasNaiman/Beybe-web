// Contract for a future server-only integration. No provider is enabled yet.
// The server must re-quote the cart and reserve stock before creating an order.
export type PaymentMethod = "mercado_pago" | "transferencia" | "efectivo";
export interface ConfirmedOrder {
  id: string;
  amountInCents: number;
  currency: "ARS";
  inventoryReservationId: string;
}
export interface PaymentProvider {
  createSession(
    order: ConfirmedOrder,
  ): Promise<{ redirectUrl?: string; reference: string; status: "pending" }>;
  verifyNotification(
    rawBody: string,
    signature: string,
  ): Promise<{ orderId: string; status: "pending" | "paid" | "failed" }>;
}
export const paymentAvailability: Record<PaymentMethod, "pending_validation"> =
  {
    mercado_pago: "pending_validation",
    transferencia: "pending_validation",
    efectivo: "pending_validation",
  };
