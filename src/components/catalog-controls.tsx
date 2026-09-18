"use client";
import Link from "next/link";
import { useRef } from "react";
import { containDialogFocus } from "./dialog-focus";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/categories";
import type { Channel } from "@/lib/commerce";

export function CatalogControls({
  channel,
  categoryId,
  query,
  sort,
  available,
}: {
  channel: Channel;
  categoryId?: string;
  query: string;
  sort: string;
  available: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const values: Record<string, string> = { modalidad: channel };
  if (categoryId) values.categoria = categoryId;
  if (query) values.q = query;
  if (sort !== "featured") values.orden = sort;
  if (available) values.disponible = "si";
  const remove = (key: string) => {
    const qs = new URLSearchParams(values);
    qs.delete(key);
    return "/catalogo?" + qs;
  };
  const chips = [
    ...(categoryId
      ? [
          {
            key: "categoria",
            label:
              categories.find((c) => c.id === categoryId)?.name ?? categoryId,
          },
        ]
      : []),
    ...(query ? [{ key: "q", label: query }] : []),
    ...(available ? [{ key: "disponible", label: "Con disponibilidad" }] : []),
    ...(sort !== "featured"
      ? [
          {
            key: "orden",
            label:
              sort === "name"
                ? "Nombre A–Z"
                : sort === "price-asc"
                  ? "Menor precio"
                  : "Mayor precio",
          },
        ]
      : []),
  ];
  return (
    <>
      <div className="catalog-tools">
        <form action="/catalogo" className="catalog-search" role="search">
          {Object.entries(values)
            .filter(([key]) => key !== "q")
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <label className="sr-only" htmlFor="catalog-search">
            Buscar artículos
          </label>
          <input
            id="catalog-search"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Nombre, código o detalle…"
          />
          <button className="icon-button" aria-label="Buscar">
            <Search size={20} />
          </button>
        </form>
        <button
          ref={trigger}
          className="filter-trigger"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <span>
            <SlidersHorizontal size={18} />
            Filtrar y ordenar
          </span>
          <span>{chips.length || "+"}</span>
        </button>
      </div>
      {chips.length > 0 && (
        <nav className="active-filters" aria-label="Filtros activos">
          {chips.map((c) => (
            <Link
              key={c.key}
              className="filter-chip"
              href={remove(c.key)}
              aria-label={"Quitar filtro: " + c.label}
            >
              {c.label}
              <X aria-hidden="true" />
            </Link>
          ))}
          <Link className="text-link" href={"/catalogo?modalidad=" + channel}>
            Limpiar todo
          </Link>
        </nav>
      )}
      <dialog
        ref={dialog}
        className="filter-sheet"
        onKeyDown={containDialogFocus}
        aria-labelledby="filter-title"
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="filter-sheet-content">
          <div className="filter-top">
            <h2 id="filter-title">Encontrá tu favorito.</h2>
            <button
              className="icon-button"
              aria-label="Cerrar filtros"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <form action="/catalogo">
            <input type="hidden" name="modalidad" value={channel} />
            <input type="hidden" name="q" value={query} />
            <fieldset>
              <legend>Categoría</legend>
              <div className="filter-categories">
                {[{ id: "", name: "Todas las categorías" }, ...categories].map(
                  (c) => (
                    <label key={c.id}>
                      <input
                        type="radio"
                        name="categoria"
                        value={c.id}
                        defaultChecked={(categoryId ?? "") === c.id}
                      />
                      {c.name}
                    </label>
                  ),
                )}
              </div>
            </fieldset>
            <label className="filter-order">
              Ordenar por
              <select name="orden" defaultValue={sort}>
                <option value="featured">Orden sugerido</option>
                <option value="price-asc">Menor precio por presentación</option>
                <option value="price-desc">
                  Mayor precio por presentación
                </option>
                <option value="name">Nombre A–Z</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="disponible"
                value="si"
                defaultChecked={available}
              />
              Con disponibilidad
            </label>
            <div className="filter-actions">
              <Link
                className="text-link"
                href={"/catalogo?modalidad=" + channel}
                onClick={() => dialog.current?.close()}
              >
                Limpiar
              </Link>
              <button className="button">Ver resultados</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
