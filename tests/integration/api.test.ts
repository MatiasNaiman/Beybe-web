import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const line = {
  productId: "demo-001",
  variantId: "crudo-rn",
  presentationId: "set",
  quantity: 2,
};
async function post(path: string, body: unknown) {
  const response = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    body: await response.json(),
    headers: response.headers,
  };
}
test("HTTP: cotización ignora precio/minimo del cliente y usa ARS50.000", async () => {
  const r = await post("/api/quote", {
    channel: "minorista",
    lines: [{ ...line, price: 1 }],
    minimum: 1,
  });
  assert.equal(r.status, 200);
  assert.equal(r.body.total, 5000000);
  assert.equal(r.body.canRequest, true);
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.equal(r.body.contactUrl, null);
});
test("HTTP: checkout rechaza mínimo insuficiente", async () => {
  const r = await post("/api/checkout/preview", {
    channel: "minorista",
    lines: [{ ...line, quantity: 1 }],
    total: 5000000,
  });
  assert.equal(r.status, 422);
});
test("HTTP: checkout válido sigue siendo preview, todos los pagos pendientes", async () => {
  const r = await post("/api/checkout/preview", {
    channel: "minorista",
    lines: [line],
  });
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "preview_only");
  assert.equal(r.body.quote.total, 5000000);
  assert.deepEqual(Object.values(r.body.paymentAvailability), [
    "pending_validation",
    "pending_validation",
    "pending_validation",
  ]);
  assert.equal(r.body.orderId, undefined);
});
test("HTTP: checkout rechaza mayorista", async () => {
  const r = await post("/api/checkout/preview", {
    channel: "mayorista",
    lines: [{ ...line, presentationId: "pack3", quantity: 3 }],
  });
  assert.equal(r.status, 400);
});
test("HTTP: mayorista debajo del mínimo no genera enlace", async () => {
  const r = await post("/api/quote", {
    channel: "mayorista",
    lines: [{ ...line, presentationId: "pack3", quantity: 2 }],
  });
  assert.equal(r.body.total, 12000000);
  assert.equal(r.body.canRequest, false);
  assert.equal(r.body.contactUrl, null);
});
test("HTTP: WhatsApp usa teléfono autorizado y contiene prueba, códigos y packs", async () => {
  const r = await post("/api/quote", {
    channel: "mayorista",
    lines: [{ ...line, presentationId: "pack3", quantity: 3 }],
  });
  assert.equal(r.body.total, 18000000);
  const url = new URL(r.body.contactUrl);
  assert.equal(url.pathname, "/5491132051182");
  assert.match(url.searchParams.get("text")!, /NO ES UN PEDIDO REAL/);
  assert.match(url.searchParams.get("text")!, /Pack de 3 sets/);
});
test("HTTP: presentaciones de otro canal y productos inexistentes no habilitan solicitud", async () => {
  for (const l of [
    { ...line, presentationId: "pack3", quantity: 3 },
    { ...line, productId: "missing" },
  ]) {
    const r = await post("/api/quote", { channel: "minorista", lines: [l] });
    assert.equal(r.body.canRequest, false);
    assert.ok(r.body.errors.length);
  }
});
test("HTTP: excesos de stock no crean preview", async () => {
  const r = await post("/api/checkout/preview", {
    channel: "minorista",
    lines: [{ ...line, quantity: 99 }],
  });
  assert.equal(r.status, 422);
});
test("HTTP: tipos y body inválidos se rechazan", async () => {
  assert.equal(
    (
      await post("/api/quote", {
        channel: "minorista",
        lines: [{ ...line, quantity: 1.5 }],
      })
    ).status,
    400,
  );
  assert.equal(
    (await post("/api/quote", { channel: "fake", lines: [] })).status,
    400,
  );
  const r = await fetch(base + "/api/quote", {
    method: "POST",
    body: "not-json",
  });
  assert.equal(r.status, 400);
});
test("HTTP: body y número de líneas limitados", async () => {
  const r = await fetch(base + "/api/quote", {
    method: "POST",
    body: " ".repeat(50001),
  });
  assert.equal(r.status, 413);
  assert.equal(
    (
      await post("/api/quote", {
        channel: "minorista",
        lines: Array(251).fill(line),
      })
    ).status,
    400,
  );
});
