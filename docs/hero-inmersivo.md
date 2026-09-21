# Hero inmersivo BEYBE — 19/09/2026

Implementado en el proyecto existente, rama `codex/demo-store-and-motion`. Recuperación anterior: etiqueta local `recovery-before-immersive-hero-2026-09-19`, commit `5fe0c24ff0d2b40e4cdcb4c3928350248c5401a4`. Sin push ni despliegue.

## Composición y recursos

Escritorio: fotografía horizontal completa junto al eslogan y los dos accesos comerciales. Móvil: fotografía vertical primero, texto y botones debajo; el encuadre elimina espacio de fondo y conserva rostro, gorrito y prenda. La transición a categorías incorpora una frase editorial y la textura B existente en escritorio.

Los originales de `sources/` se preservan. Son imágenes generadas con IA a partir de prendas reales, según la información del propietario. El texto alternativo identifica su procedencia. Se exportaron seis WebP de 63–166 KB, sin retoque del contenido. `picture` elige una orientación mediante media query y una resolución mediante srcset; no hay dos imágenes ocultas ni precargas simultáneas. En navegador se verificó mobile-480 a 390 px y desktop-960 a 1440 px. La herramienta no permitió inspeccionar Resource Timing para auditar transferencias.

La mariposa independiente conserva los primeros cinco subtrazados exactos del SVG original: silueta y sus cuatro huecos. Solo cambia el viewBox; el logo del encabezado permanece intacto.

## Movimiento

GSAP y ScrollTrigger existentes: entrada leve del título y símbolo, recorrido curvo lateral con rotación pequeña, desaparición hacia las colecciones y acercamiento fotográfico máximo de 1,2% en escritorio / 0,6% en móvil. Sin pin ni interceptar el scroll. El isotipo permanece rígido para preservar la marca; su zona lateral no interfiere con fotografía, texto o botones.

`matchMedia` y el contexto de `useGSAP` revierten estilos al desmontar o cambiar de breakpoint. Con movimiento reducido no se crean animaciones. El contenido esencial siempre es visible en el HTML estático.

## Archivos

- `src/components/campaign-hero.tsx`: estructura semántica y selección de fotografías.
- `src/components/hero-motion.tsx`: animación acotada a la portada.
- `src/app/campaign.css`: composición responsive y transición.
- `src/app/page.tsx`, `src/app/layout.tsx`: integración.
- `src/app/home.css`: retirada de estilos del hero anterior.
- `public/hero/`: seis fotografías optimizadas.
- `public/brand/butterfly.svg`: isotipo reutilizable.
- `scripts/prepare-hero-assets.mjs`: exportación reproducible con Sharp ya incluido por Next.
- `README.md` y este informe: documentación.

No se modificaron catálogo, datos, lógica de precios, mínimos, stock, carrito, checkout ni pagos. No se añadieron dependencias.

## Verificación

- 25/25 pruebas unitarias e integración HTTP aprobadas.
- `npm run typecheck` aprobado.
- `npm run build` aprobado; 12 páginas generadas.
- Medición en navegador a 320, 375, 390, 430, 768 y 1440 px: sin desbordamiento horizontal; botones de al menos 48 px de alto.
- Revisión visual mediante capturas en navegador, especialmente composición móvil de 390 px y escritorio de 1440 px. Algunas capturas tomadas inmediatamente después de redimensionar resultaron parciales; no se consideran evidencia visual completa de todos los tamaños.
- Vuelo móvil comprobado con scroll, cambios de tamaño y retorno a la portada. Accesos a catálogo y mayoristas comprobados en versión compilada. Consola sin errores durante la revisión de desarrollo.
- Las capturas se mostraron durante la revisión; no quedaron archivos de captura guardados porque la API disponible entrega la imagen sin ruta de exportación.

Pendiente manual: Safari/iPhone físico, ajuste de movimiento reducido del sistema, rendimiento con red móvil real y revisión visual completa de los tamaños intermedios. La preferencia de movimiento reducido fue revisada en código, no emulada en el navegador.

Vista previa de entrega: `http://127.0.0.1:3002/`. Si el proceso se cierra, desde `web` ejecutar `npm run start -- --port 3002` (build ya generado). Para editar: `npm run dev -- --port 3002`, deteniendo antes el servidor que use ese puerto.
