import { test } from "node:test";
import assert from "node:assert/strict";
import data from "../src/data/products.json";
import {
  catalogSchema,
  productSchema,
  quoteCart,
  requestSchema,
  orderMessage,
  whatsappUrl,
  type CartLine,
  type Product,
} from "../src/lib/commerce";
const products = catalogSchema.parse(data);
const line = (
  productId = "demo-001",
  variantId = "crudo-rn",
  presentationId = "set",
  quantity = 1,
): CartLine => ({ productId, variantId, presentationId, quantity });
test("8 ejemplos válidos, seis categorías y exclusividad mayorista", () => {
  assert.equal(products.length, 8);
  assert.equal(new Set(products.map((p) => p.category)).size, 6);
  assert.equal(products[5].retailEnabled, false);
});
test("mínimo minorista exacto, debajo y arriba", () => {
  assert.equal(quoteCart([line()], "minorista", products).remaining, 2500000);
  assert.equal(
    quoteCart([line(undefined, undefined, undefined, 2)], "minorista", products)
      .canRequest,
    true,
  );
  assert.equal(
    quoteCart([line(undefined, undefined, undefined, 3)], "minorista", products)
      .total,
    7500000,
  );
});
test("mínimo mayorista independiente, precios por pack", () => {
  const below = quoteCart(
    [line(undefined, undefined, "pack3", 2)],
    "mayorista",
    products,
  );
  assert.equal(below.total, 12000000);
  assert.equal(below.canRequest, false);
  assert.equal(
    quoteCart([line(undefined, undefined, "pack3", 3)], "mayorista", products)
      .canRequest,
    true,
  );
});
test("mínimo mayorista exacto", () => {
  const p = structuredClone(products);
  p[0].variants[0].sales.mayorista![0].price = 5000000;
  assert.equal(
    quoteCart([line(undefined, undefined, "pack3", 3)], "mayorista", p)
      .remaining,
    0,
  );
});
test("cliente no elige precios, subtotales, demo ni mínimos", () => {
  const r = requestSchema.parse({
    channel: "minorista",
    lines: [
      { ...line(undefined, undefined, undefined, 2), price: 1, total: 1 },
    ],
    minimum: 1,
    demo: false,
  });
  assert.equal(quoteCart(r.lines, r.channel, products).total, 5000000);
  assert.equal(quoteCart(r.lines, r.channel, products).demo, true);
});
test("canales y presentaciones no se mezclan", () => {
  assert.equal(
    quoteCart([line(undefined, undefined, "pack3", 3)], "minorista", products)
      .canRequest,
    false,
  );
  assert.equal(
    quoteCart(
      [line("demo-006", "surtido", "surtido12", 6)],
      "minorista",
      products,
    ).canRequest,
    false,
  );
});
test("stock compartido entre unidad y pack en la misma variante", () => {
  const q = quoteCart(
    [
      line("demo-007", "crudo", "duo", 10),
      line("demo-007", "crudo", "pack6", 2),
    ],
    "minorista",
    products,
  );
  assert.ok(q.errors.some((e) => e.includes("stock compartido")));
  assert.equal(q.canRequest, false);
});
test("variantes tienen stock independiente", () => {
  assert.equal(
    quoteCart(
      [
        line("demo-003", "crudo", "unidad", 10),
        line("demo-003", "agua", "unidad", 10),
      ],
      "minorista",
      products,
    ).canRequest,
    true,
  );
});
test("stock expresado en unidades, no packs", () => {
  assert.equal(
    quoteCart([line("demo-002", "agua-3m", "pack6", 3)], "mayorista", products)
      .canRequest,
    false,
  );
});
test("mínimo e incremento de surtidos", () => {
  assert.equal(
    quoteCart(
      [line("demo-006", "surtido", "surtido12", 5)],
      "mayorista",
      products,
    ).canRequest,
    false,
  );
  assert.equal(
    quoteCart(
      [line("demo-006", "surtido", "surtido12", 6)],
      "mayorista",
      products,
    ).canRequest,
    true,
  );
});
test("agotado, inactivo, desconocido y bolsa vacía bloquean", () => {
  const p = structuredClone(products);
  p[0].active = false;
  assert.equal(
    quoteCart([line(undefined, undefined, undefined, 2)], "minorista", p)
      .canRequest,
    false,
  );
  for (const lines of [
    [],
    [line("unknown")],
    [line("demo-008", "crudo", "unidad", 10)],
  ])
    assert.equal(quoteCart(lines, "minorista", products).canRequest, false);
});
test("cantidades inválidas y duplicados", () => {
  for (const quantity of [-1, 0, 1.5, 1000, NaN])
    assert.equal(
      quoteCart(
        [line(undefined, undefined, undefined, quantity)],
        "minorista",
        products,
      ).canRequest,
      false,
    );
  assert.equal(
    quoteCart([line(), line()], "minorista", products).canRequest,
    false,
  );
});
test("disponibilidad a consultar solo mayorista, sin inventar stock", () => {
  const p = structuredClone(products);
  p[0].variants[0].stock = null;
  p[0].variants[0].availability = "on_request";
  assert.equal(
    quoteCart([line(undefined, undefined, undefined, 2)], "minorista", p)
      .canRequest,
    false,
  );
  assert.equal(
    quoteCart([line(undefined, undefined, "pack3", 3)], "mayorista", p)
      .canRequest,
    true,
  );
});
test("importación rechaza códigos repetidos, mezcla real/demo y formatos incoherentes", () => {
  assert.equal(
    catalogSchema.safeParse([...products, products[0]]).success,
    false,
  );
  const p = structuredClone(products);
  p[0].demo = false;
  assert.equal(catalogSchema.safeParse(p).success, false);
  p[0].variants[0].sales.minorista![0].units = 12;
  assert.equal(productSchema.safeParse(p[0]).success, false);
});
test("pedido WhatsApp identifica prueba, códigos, presentación, unidades y total", () => {
  const q = quoteCart(
    [line(undefined, undefined, "pack3", 3)],
    "mayorista",
    products,
  );
  const message = orderMessage(q, "mayorista");
  for (const token of [
    "NO ES UN PEDIDO REAL",
    "DEMO-001",
    "9 unidades",
    "Pack de 3 sets",
    "180.000",
    "disponibilidad, envío y pago",
  ])
    assert.ok(message.includes(token));
  const url = whatsappUrl("5491132051182", message);
  assert.equal(new URL(url!).searchParams.get("text"), message);
  assert.equal(whatsappUrl("bad", message), null);
});
