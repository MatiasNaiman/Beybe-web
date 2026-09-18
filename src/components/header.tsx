"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Brand } from "./brand";
import { useShop } from "./shop-provider";
const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nuestra historia" },
  { href: "/mayoristas", label: "Venta mayorista" },
];
export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { carts } = useShop();
  const count = [...carts.minorista, ...carts.mayorista].reduce(
    (sum, i) => sum + i.quantity,
    0,
  );
  const close = () => dialog.current?.close();
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);
  return (
    <>
      <div className="announcement">Fabricación propia desde 1998</div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" aria-label="BEYBE · Inicio">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/catalogo" className="button compact header-catalog">
              Ver catálogo
            </Link>
            <Link
              href="/bolsa"
              className="icon-button bag-link"
              aria-label={`Bolsa, ${count} artículos`}
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {count > 0 && (
                <span className="bag-count">{count > 99 ? "99+" : count}</span>
              )}
            </Link>
            <button
              ref={menuButton}
              className="icon-button mobile-menu"
              aria-label="Abrir menú"
              aria-haspopup="dialog"
              onClick={() => dialog.current?.showModal()}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-labelledby="menu-title"
        onClose={() => menuButton.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="menu-top">
          <span id="menu-title">Explorá BEYBE</span>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Cerrar menú"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Navegación móvil">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/ayuda" onClick={close}>
            Cómo comprar <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <p className="muted">Vistiendo al futuro.</p>
      </dialog>
    </>
  );
}
