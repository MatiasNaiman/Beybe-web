import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";
import { requestSchema, quoteCart } from "@/lib/commerce";
import { paymentAvailability } from "@/lib/payments";
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" },
    raw = await request.text();
  if (raw.length > 50000)
    return NextResponse.json(
      { error: "Pedido demasiado extenso." },
      { status: 413, headers },
    );
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Pedido inválido." },
      { status: 400, headers },
    );
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success || parsed.data.channel !== "minorista")
    return NextResponse.json(
      { error: "Usá la modalidad minorista para esta revisión." },
      { status: 400, headers },
    );
  const quote = quoteCart(parsed.data.lines, "minorista", await catalog.list());
  if (!quote.canRequest)
    return NextResponse.json(
      { error: "El pedido no cumple las reglas comerciales.", quote },
      { status: 422, headers },
    );
  return NextResponse.json(
    {
      quote,
      status: "preview_only",
      paymentAvailability,
      message: "Vista previa sin orden creada, reserva de stock ni cobro.",
    },
    { headers },
  );
}
