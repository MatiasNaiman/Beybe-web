"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  cartLineSchema,
  lineKey,
  type CartLine,
  type Channel,
} from "@/lib/commerce";
type Carts = Record<Channel, CartLine[]>;
type Shop = {
  carts: Carts;
  ready: boolean;
  setQuantity: (c: Channel, l: CartLine) => void;
  add: (c: Channel, l: CartLine) => void;
  remove: (c: Channel, l: CartLine) => void;
  notice: string;
};
const empty: Carts = { minorista: [], mayorista: [] },
  Context = createContext<Shop | null>(null),
  storageKey = "beybe-bag-v2";
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
  const [carts, setCarts] = useState<Carts>(empty),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      setCarts(readCarts(localStorage.getItem(storageKey)));
    } catch {}
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey) setCarts(readCarts(e.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(storageKey, JSON.stringify(carts));
      } catch {}
  }, [carts, ready]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const update = (c: Channel, l: CartLine, increment = false) => {
    if (!ready || !cartLineSchema.safeParse(l).success) return;
    setCarts((prev) => {
      const current = prev[c].find((i) => lineKey(i) === lineKey(l)),
        rest = prev[c].filter((i) => lineKey(i) !== lineKey(l));
      const next = {
        ...l,
        quantity: increment
          ? (current?.quantity ?? 0) + l.quantity
          : l.quantity,
      };
      if (rest.length >= 250 || !cartLineSchema.safeParse(next).success)
        return prev;
      return { ...prev, [c]: [...rest, next] };
    });
  };
  const add = (c: Channel, l: CartLine) => {
    update(c, l, true);
    setNotice("Agregado a tu bolsa " + c + ".");
  };
  const remove = (c: Channel, l: CartLine) => {
    setCarts((prev) => ({
      ...prev,
      [c]: prev[c].filter((i) => lineKey(i) !== lineKey(l)),
    }));
    setNotice("Artículo eliminado de tu bolsa.");
  };
  return (
    <Context.Provider
      value={{
        carts,
        ready,
        setQuantity: (c, l) => update(c, l),
        add,
        remove,
        notice,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        className={notice ? "shop-toast visible" : "shop-toast"}
      >
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useShop() {
  const c = useContext(Context);
  if (!c) throw new Error("ShopProvider missing");
  return c;
}
