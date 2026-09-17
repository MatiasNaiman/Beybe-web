import test from "node:test";
import assert from "node:assert/strict";
import {
  quoteCart,
  requestSchema,
  productSchema,
  whatsappUrl,
  orderMessage,
  type Product,
  type CartLine,
} from "../src/lib/commerce";
const product: Product = {
  id: "test",
  slug: "articulo-de-prueba",
  name: "Artículo de prueba",
  description: "Solo para tests, no es un producto comercial.",
  category: "ropa",
  images: [{ src: "/products/test.webp", alt: "Prueba" }],
  variants: [
    {
      id: "v1",
      sku: "TEST-001",
      label: "Talle de prueba",
      stock: 100,
      sales: {
        minorista: { price: 1_000_000, minQuantity: 1, step: 1 },
        mayorista: { price: 750_000, minQuantity: 4, step: 2 },
      },
    },
  ],
};
const line = (quantity: number): CartLine => ({
  productId: "test",
  variantId: "v1",
  quantity,
});
test("minorista: bloquea antes de $50.000 y acepta el límite exacto", () => {
  assert.equal(
    quoteCart([line(4)], "minorista", [product]).remaining,
    1_000_000,
  );
  assert.equal(quoteCart([line(4)], "minorista", [product]).canRequest, false);
  assert.equal(quoteCart([line(5)], "minorista", [product]).canRequest, true);
});
test("mayorista: exige $150.000 e incrementos de la variante", () => {
  assert.equal(quoteCart([line(18)], "mayorista", [product]).canRequest, false);
  assert.equal(quoteCart([line(20)], "mayorista", [product]).canRequest, true);
  assert.equal(quoteCart([line(21)], "mayorista", [product]).errors.length, 1);
});
test("rechaza cantidades fraccionarias, negativas, sin stock o inferiores al paquete", () => {
  for (const n of [-1, 0, 1.5, 101, Infinity])
    assert.equal(
      quoteCart([line(n)], "minorista", [product]).canRequest,
      false,
    );
  assert.equal(quoteCart([line(2)], "mayorista", [product]).errors.length, 1);
});
test("un artículo desconocido invalida el pedido completo", () => {
  const quote = quoteCart(
    [line(5), { productId: "missing", variantId: "x", quantity: 1 }],
    "minorista",
    [product],
  );
  assert.equal(quote.total, 5_000_000);
  assert.equal(quote.canRequest, false);
});
test("no duplica stock ni importe con líneas repetidas", () => {
  const q = quoteCart([line(5), line(5)], "minorista", [product]);
  assert.equal(q.items.length, 1);
  assert.equal(q.canRequest, false);
});
test("toma el precio del catálogo, no del navegador", () => {
  const input = requestSchema.parse({
    channel: "minorista",
    lines: [{ ...line(5), price: 1, total: 5 }],
  });
  assert.equal(
    quoteCart(input.lines, input.channel, [product]).total,
    5_000_000,
  );
});
test("bolsa vacía no permite confirmar", () =>
  assert.equal(quoteCart([], "minorista", [product]).canRequest, false));
test("respeta disponibilidad por modalidad", () => {
  const retailOnly = structuredClone(product);
  delete retailOnly.variants[0].sales.mayorista;
  assert.equal(
    quoteCart([line(20)], "mayorista", [retailOnly]).canRequest,
    false,
  );
});
test("valida importaciones de catálogo y límites del pedido", () => {
  assert.equal(productSchema.safeParse(product).success, true);
  assert.equal(
    requestSchema.safeParse({ channel: "otro", lines: [] }).success,
    false,
  );
  assert.equal(
    requestSchema.safeParse({
      channel: "minorista",
      lines: Array(251).fill(line(1)),
    }).success,
    false,
  );
});
test("WhatsApp no inventa contactos y codifica el contenido", () => {
  assert.equal(whatsappUrl(undefined, "hola"), null);
  assert.equal(whatsappUrl("abc", "hola"), null);
  const q = quoteCart([line(20)], "mayorista", [product]);
  const message = orderMessage(q, "mayorista");
  assert.ok(message.includes("no una compra confirmada"));
  assert.ok(
    whatsappUrl("5491100000000", message)?.includes(
      encodeURIComponent("SKU TEST-001"),
    ),
  );
});
