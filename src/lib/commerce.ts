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
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
export const presentationSchema = z
  .object({
    id,
    label: z.string().min(1),
    kind: z.enum(["unidad", "pack", "docena", "surtido"]),
    units: z.number().int().min(1).max(1000),
    price: z.number().int().positive().max(1_000_000_000),
    minQuantity: z.number().int().min(1).max(999),
    step: z.number().int().min(1).max(999),
  })
  .superRefine((p, ctx) => {
    if (
      (p.kind === "unidad" && p.units !== 1) ||
      (p.kind === "docena" && p.units !== 12)
    )
      ctx.addIssue({
        code: "custom",
        message: "Unidad = 1; docena = 12 unidades.",
      });
  });
export const productSchema = z
  .object({
    id,
    sku: id,
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(categoryIds),
    active: z.boolean(),
    demo: z.boolean(),
    retailEnabled: z.boolean(),
    images: z.array(
      z.object({
        src: z
          .string()
          .regex(/^\/products\/[a-zA-Z0-9_/-]+\.(webp|png|jpg|jpeg|avif)$/),
        alt: z.string().min(1),
      }),
    ),
    variants: z
      .array(
        z.object({
          id,
          sku: id,
          label: z.string().min(1),
          options: z.record(z.string(), z.string()),
          stock: z.number().int().min(0).max(1_000_000).nullable(),
          availability: z.enum(["available", "on_request", "unavailable"]),
          sales: z.object({
            minorista: z.array(presentationSchema).min(1).optional(),
            mayorista: z.array(presentationSchema).min(1).optional(),
          }),
        }),
      )
      .min(1),
  })
  .superRefine((p, ctx) => {
    if (
      p.variants.some((v) => v.availability === "available" && v.stock === null)
    )
      ctx.addIssue({
        code: "custom",
        message: "Disponibilidad inmediata requiere stock numérico.",
      });
    if (!p.retailEnabled && p.variants.some((v) => v.sales.minorista))
      ctx.addIssue({
        code: "custom",
        message:
          "Un artículo exclusivo mayorista no admite ofertas minoristas.",
      });
    if (
      new Set(p.variants.map((v) => v.id)).size !== p.variants.length ||
      p.variants.some((v) =>
        channels.some(
          (c) =>
            new Set(v.sales[c]?.map((s) => s.id)).size !==
            (v.sales[c]?.length ?? 0),
        ),
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "IDs de variantes o presentaciones duplicados.",
      });
  });
export const catalogSchema = productSchema
  .array()
  .max(10000)
  .superRefine((products, ctx) => {
    const groups = [
      products.map((p) => p.id),
      products.map((p) => p.slug),
      products.flatMap((p) => [p.sku, ...p.variants.map((v) => v.sku)]),
    ];
    if (groups.some((v) => new Set(v).size !== v.length))
      ctx.addIssue({
        code: "custom",
        message: "IDs, slugs y códigos SKU deben ser únicos.",
      });
    if (products.some((p) => p.demo) && products.some((p) => !p.demo))
      ctx.addIssue({
        code: "custom",
        message: "No mezclar catálogo demostrativo y real.",
      });
  });
export type Product = z.infer<typeof productSchema>;
export type Presentation = z.infer<typeof presentationSchema>;
export const cartLineSchema = z.object({
  productId: id,
  variantId: id,
  presentationId: id,
  quantity: z.number().int().min(1).max(999),
});
export type CartLine = z.infer<typeof cartLineSchema>;
export const requestSchema = z.object({
  channel: z.enum(channels),
  lines: z.array(cartLineSchema).max(250),
});
export const lineKey = (
  l: Pick<CartLine, "productId" | "variantId" | "presentationId">,
) => JSON.stringify([l.productId, l.variantId, l.presentationId]);
export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
export function channelFrom(value: unknown): Channel {
  return value === "mayorista" ? "mayorista" : "minorista";
}
export function offers(p: Product, c: Channel) {
  return p.active && (c !== "minorista" || p.retailEnabled)
    ? p.variants.flatMap((v) => v.sales[c] ?? [])
    : [];
}
export function availableUnits(v: Product["variants"][number], c: Channel) {
  if (
    v.availability === "unavailable" ||
    (v.availability === "on_request" && c === "minorista")
  )
    return 0;
  return v.stock ?? 999_000;
}
export function quoteCart(
  lines: CartLine[],
  channel: Channel,
  products: Product[],
) {
  const errors: string[] = [],
    seen = new Set<string>();
  const items = lines.flatMap((line) => {
    if (!cartLineSchema.safeParse(line).success || seen.has(lineKey(line))) {
      errors.push(
        "Hay cantidades inválidas o artículos repetidos. Revisá tu bolsa.",
      );
      return [];
    }
    seen.add(lineKey(line));
    const product = products.find((p) => p.id === line.productId && p.active);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    const sale = variant?.sales[channel]?.find(
      (s) => s.id === line.presentationId,
    );
    if (
      !product ||
      !variant ||
      !sale ||
      (channel === "minorista" && !product.retailEnabled)
    ) {
      errors.push(
        "Un artículo o presentación ya no está disponible en esta modalidad.",
      );
      return [];
    }
    const stock = Math.min(
      999,
      Math.floor(availableUnits(variant, channel) / sale.units),
    );
    if (
      line.quantity < sale.minQuantity ||
      (line.quantity - sale.minQuantity) % sale.step !== 0 ||
      line.quantity > stock
    )
      errors.push(
        "Revisá la cantidad de " +
          product.name +
          ": mínimo " +
          sale.minQuantity +
          ", incrementos de " +
          sale.step +
          ", máximo " +
          stock +
          " presentaciones.",
      );
    return [
      {
        ...line,
        name: product.name,
        slug: product.slug,
        label: variant.label,
        sku: variant.sku,
        productSku: product.sku,
        presentation: sale.label,
        units: sale.units,
        price: sale.price,
        total: sale.price * line.quantity,
        image: product.images[0] ?? null,
        category: product.category,
        demo: product.demo,
        minQuantity: sale.minQuantity,
        step: sale.step,
        stock,
        physicalStock: availableUnits(variant, channel),
        availability: variant.availability,
      },
    ];
  });
  const pools = new Map<string, number>();
  for (const i of items) {
    const pool = JSON.stringify([i.productId, i.variantId]);
    pools.set(pool, (pools.get(pool) ?? 0) + i.quantity * i.units);
  }
  for (const i of items)
    if (
      (pools.get(JSON.stringify([i.productId, i.variantId])) ?? 0) >
      i.physicalStock
    )
      errors.push(
        "Las presentaciones de " +
          i.name +
          " superan el stock compartido de esa variante.",
      );
  const total = items.reduce((sum, i) => sum + i.total, 0),
    remaining = Math.max(0, minimums[channel] - total);
  return {
    items,
    total,
    remaining,
    minimum: minimums[channel],
    errors: [...new Set(errors)],
    demo: items.some((i) => i.demo),
    canRequest: items.length > 0 && errors.length === 0 && remaining === 0,
  };
}
export type Quote = ReturnType<typeof quoteCart>;
export function whatsappUrl(number: string | undefined, message: string) {
  return number && /^[1-9]\d{7,14}$/.test(number)
    ? "https://wa.me/" + number + "?text=" + encodeURIComponent(message)
    : null;
}
export function orderMessage(quote: Quote, channel: Channel) {
  return [
    quote.demo
      ? "PRUEBA DEMOSTRATIVA — artículos y precios ficticios. NO ES UN PEDIDO REAL."
      : "Solicitud de pedido " + channel + " BEYBE",
    ...quote.items.map(
      (i) =>
        "• " +
        i.name +
        " | Código " +
        i.productSku +
        " | SKU " +
        i.sku +
        " | " +
        i.label +
        " | " +
        i.quantity +
        " × " +
        i.presentation +
        " (" +
        i.quantity * i.units +
        " unidades) | " +
        formatMoney(i.total),
    ),
    "Total estimado de artículos: " + formatMoney(quote.total) + " ARS.",
    "BEYBE confirma disponibilidad, envío y pago. Sin reserva de stock ni compra confirmada.",
  ].join("\n");
}
