import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";
import {
  requestSchema,
  quoteCart,
  whatsappUrl,
  orderMessage,
} from "@/lib/commerce";
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const raw = await request.text();
  if (raw.length > 50_000)
    return NextResponse.json(
      { error: "El pedido es demasiado extenso." },
      { status: 413, headers },
    );
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el pedido." },
      { status: 400, headers },
    );
  }
  const parsed = requestSchema.safeParse(data);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Revisá los artículos y cantidades del pedido." },
      { status: 400, headers },
    );
  const { channel, lines } = parsed.data;
  const quote = quoteCart(lines, channel, await catalog.list());
  const contactUrl =
    channel === "mayorista" && quote.canRequest
      ? whatsappUrl(
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
          orderMessage(quote, channel),
        )
      : null;
  return NextResponse.json({ ...quote, contactUrl }, { headers });
}
