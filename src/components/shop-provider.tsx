"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cartLineSchema, type CartLine, type Channel } from "@/lib/commerce";
type Carts = Record<Channel, CartLine[]>;
type Shop = {
  carts: Carts;
  ready: boolean;
  setQuantity: (channel: Channel, line: CartLine) => void;
  remove: (channel: Channel, productId: string, variantId: string) => void;
};
const empty: Carts = { minorista: [], mayorista: [] };
const Context = createContext<Shop | null>(null);
const storageKey = "beybe-bag-v1";
function readCarts(raw: string | null): Carts {
  try {
    const data = JSON.parse(raw ?? "{}");
    return {
      minorista: cartLineSchema
        .array()
        .max(250)
        .parse(data.minorista ?? []),
      mayorista: cartLineSchema
        .array()
        .max(250)
        .parse(data.mayorista ?? []),
    };
  } catch {
    return empty;
  }
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<Carts>(empty);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setCarts(readCarts(localStorage.getItem(storageKey)));
    } catch {
      /* Storage may be disabled. */
    }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey) setCarts(readCarts(e.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(carts));
      } catch {
        /* In-memory shopping remains available. */
      }
    }
  }, [carts, ready]);
  const setQuantity = (channel: Channel, line: CartLine) => {
    if (!cartLineSchema.safeParse(line).success) return;
    setCarts((previous) => {
      const rest = previous[channel].filter(
        (i) => i.productId !== line.productId || i.variantId !== line.variantId,
      );
      if (rest.length >= 250) return previous;
      return { ...previous, [channel]: [...rest, line] };
    });
  };
  const remove = (channel: Channel, productId: string, variantId: string) =>
    setCarts((prev) => ({
      ...prev,
      [channel]: prev[channel].filter(
        (i) => i.productId !== productId || i.variantId !== variantId,
      ),
    }));
  return (
    <Context.Provider value={{ carts, ready, setQuantity, remove }}>
      {children}
    </Context.Provider>
  );
}
export function useShop() {
  const context = useContext(Context);
  if (!context) throw new Error("ShopProvider missing");
  return context;
}
