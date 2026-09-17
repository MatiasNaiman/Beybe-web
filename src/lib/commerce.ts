import { z } from "zod";
export const channels = ["minorista", "mayorista"] as const;
export type Channel = (typeof channels)[number];
export const minimums: Record<Channel, number> = {
  minorista: 5_000_000,
  mayorista: 15_000_000,
};
export const categoryIds = [
  "ajuar",
  "ropa",
  "bano",
  "mantillas",
  "baberos",
  "gorritos",
] as const;
const saleSchema = z.object({
  price: z.number().int().positive().max(1_000_000_000),
  minQuantity: z.number().int().min(1).max(999),
  step: z.number().int().min(1).max(999),
});
export const productSchema = z.object({
  id: z.string().min(1).max(80),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(categoryIds),
  images: z
    .array(
      z.object({
        src: z.string().startsWith("/products/"),
        alt: z.string().min(1),
      }),
    )
    .min(1),
  variants: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        sku: z.string().min(1),
        label: z.string().min(1),
        stock: z.number().int().min(0).max(999),
        sales: z.object({
          minorista: saleSchema.optional(),
          mayorista: saleSchema.optional(),
        }),
      }),
    )
    .min(1),
});
export type Product = z.infer<typeof productSchema>;
export const cartLineSchema = z.object({
  productId: z.string().min(1).max(80),
  variantId: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(999),
});
export type CartLine = z.infer<typeof cartLineSchema>;
export const requestSchema = z.object({
  channel: z.enum(channels),
  lines: z.array(cartLineSchema).max(250),
});
export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
export function channelFrom(value: unknown): Channel {
  return value === "mayorista" ? "mayorista" : "minorista";
}
export function quoteCart(
  lines: CartLine[],
  channel: Channel,
  products: Product[],
) {
  const errors: string[] = [];
  const seen = new Set<string>();
  const items = lines.flatMap((line) => {
    const key = line.productId + ":" + line.variantId;
    if (seen.has(key)) {
      errors.push("Hay artículos repetidos. Actualizá tu bolsa.");
      return [];
    }
    seen.add(key);
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    const sale = variant?.sales[channel];
    if (!product || !variant || !sale) {
      errors.push("Un artículo ya no está disponible en esta modalidad.");
      return [];
    }
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < sale.minQuantity ||
      line.quantity > variant.stock ||
      line.quantity > 999 ||
      (line.quantity - sale.minQuantity) % sale.step !== 0
    ) {
      errors.push(
        `Revisá la cantidad disponible de ${product.name} (${variant.label}).`,
      );
      return [];
    }
    return [
      {
        ...line,
        name: product.name,
        label: variant.label,
        sku: variant.sku,
        price: sale.price,
        total: sale.price * line.quantity,
        image: product.images[0],
        minQuantity: sale.minQuantity,
        step: sale.step,
        stock: variant.stock,
      },
    ];
  });
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const remaining = Math.max(0, minimums[channel] - total);
  return {
    items,
    total,
    remaining,
    minimum: minimums[channel],
    errors,
    canRequest: items.length > 0 && errors.length === 0 && remaining === 0,
  };
}
export type Quote = ReturnType<typeof quoteCart>;
export function whatsappUrl(number: string | undefined, message: string) {
  return number && /^[1-9]\d{7,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
}
export function orderMessage(quote: Quote, channel: Channel) {
  return [
    `Hola BEYBE, quisiera consultar este pedido ${channel}:`,
    ...quote.items.map(
      (i) => `• ${i.name} · ${i.label} · SKU ${i.sku} × ${i.quantity}`,
    ),
    `Subtotal de artículos: ${formatMoney(quote.total)} ARS.`,
    "A confirmar: stock, precios, envío y forma de pago. Este mensaje es una solicitud, no una compra confirmada.",
  ].join("\n");
}
