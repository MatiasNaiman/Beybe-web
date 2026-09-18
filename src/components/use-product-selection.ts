"use client";
import { useState } from "react";
import {
  availableUnits,
  quoteCart,
  lineKey,
  type Product,
  type Channel,
} from "@/lib/commerce";
import { useShop } from "./shop-provider";
export function useProductSelection(p: Product, channel: Channel) {
  const variants = p.variants.filter((v) => v.sales[channel]?.length);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? ""),
    [presentationId, setPresentationId] = useState(
      variants[0]?.sales[channel]?.[0].id ?? "",
    );
  const [quantity, setQuantity] = useState(
      variants[0]?.sales[channel]?.[0].minQuantity ?? 1,
    ),
    [added, setAdded] = useState(false);
  const { carts, ready, add } = useShop(),
    variant = variants.find((v) => v.id === variantId),
    sale = variant?.sales[channel]?.find((s) => s.id === presentationId);
  const line = { productId: p.id, variantId, presentationId, quantity },
    existing = carts[channel].find((i) => lineKey(i) === lineKey(line));
  const proposed = [
    ...carts[channel].filter(
      (i) => i.productId === p.id && lineKey(i) !== lineKey(line),
    ),
    { ...line, quantity: (existing?.quantity ?? 0) + quantity },
  ];
  const check = quoteCart(proposed, channel, [p]),
    max =
      variant && sale
        ? Math.min(
            999,
            Math.floor(availableUnits(variant, channel) / sale.units),
          )
        : 0;
  const cartHasRoom = !!existing || carts[channel].length < 250;
  const valid =
    !!sale &&
    quantity >= sale.minQuantity &&
    check.errors.length === 0 &&
    ready &&
    cartHasRoom;
  function chooseVariant(id: string) {
    const v = variants.find((v) => v.id === id)!;
    const s = v.sales[channel]![0];
    setVariantId(id);
    setPresentationId(s.id);
    setQuantity(s.minQuantity);
    setAdded(false);
  }
  function choosePresentation(id: string) {
    const s = variant!.sales[channel]!.find((s) => s.id === id)!;
    setPresentationId(id);
    setQuantity(s.minQuantity);
    setAdded(false);
  }
  return {
    variants,
    variantId,
    variant,
    sale,
    quantity,
    added,
    check,
    max,
    valid,
    cartHasRoom,
    chooseVariant,
    choosePresentation,
    changeQuantity: (n: number) => {
      setQuantity(n);
      setAdded(false);
    },
    addToCart: () => {
      if (valid) {
        add(channel, line);
        setAdded(true);
      }
    },
  };
}
