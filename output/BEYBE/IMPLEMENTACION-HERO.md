# Hero editorial implementado — 25/09/2026

Proyecto: C:\Users\glady\Downloads\mati udesa\Beybe-web
Base de recuperación: commit 4ba2320 y copias previas en output/BEYBE/recovery-hero-before-implementation/.
No se hizo commit, push, merge ni deploy.

## Archivos
- src/components/campaign-hero.tsx: fotografía responsive, texto editorial y enlaces originales.
- src/components/hero-motion.tsx: timeline reversible con GSAP, ScrollTrigger y MotionPathPlugin.
- src/components/campaign-butterfly.tsx: SVG articulado inline a partir del asset aprobado, conservando su trazado.
- src/app/campaign.css: composición full-width, tipografía, botones pill y adaptación móvil/tablet.
- public/hero/bebes-editorial-{960,1440,1672}.webp: fotografía horizontal optimizada (80–165 KB). Móvil reutiliza sus variantes existentes.

## Comportamiento
La mariposa comienza oculta, entra por arriba a la derecha y sigue una curva dentro de la fotografía. Cruza el texto según confirmación expresa del usuario. No intercepta clics. Alas con movimiento independiente y cuerpo estable; el aleteo se pausa fuera de la secuencia o al ocultar la pestaña.
Desktop: tramo de 0,95 alturas de ventana, entrada 8–24%, fade 72–90%. Móvil: 0,55 alturas, entrada 10–26%, fade 62–78%. CTAs escalonados desde 18% y 34% (32% móvil). Scroll inverso revierte el vuelo.
Pin solamente con altura de ventana de al menos 800px y hero que cabe bajo el encabezado. En ventanas bajas se usa scroll normal y CTAs visibles para conservar el acceso a comprar. Es una adaptación de accesibilidad respecto del pin general del handoff.
Con prefers-reduced-motion: sin pin, sin mariposa, botones visibles. Sin JavaScript: contenido y enlaces visibles; mariposa oculta. Al usar Tab los botones quedan visibles sin exigir scroll.
Tablet: altura ajustada para conservar ambos bebés. Móvil: encuadre 50% 40% para preservar el gorrito y rostro.

## Verificación
- 15 pruebas unitarias existentes aprobadas.
- 10 pruebas HTTP de integración aprobadas contra puerto 3004.
- TypeScript aprobado.
- Build de producción aprobado; repetido después del ajuste final de teclado.
- Revisión visual real en navegador a 320, 360, 375, 390, 430, 768, 1024 y 1440 px.
- Vuelo visible, retroceso y desaparición al avanzar hacia colecciones revisados en escritorio; entrada y CTAs revisados en móvil.
- Confirmado uso de foto móvil a 390px y horizontal a partir de 768px mediante currentSrc.
- Comprobación de ancho a 320px tras recarga: scrollWidth 305 frente a viewport 320, sin desbordamiento. Durante redimensionado inmediato el pin necesita su refresh para estabilizar dimensiones.
- Enlace minorista comprobado hasta /catalogo. Sin errores de consola capturados durante la revisión inicial.

## Límites de la revisión
Reduced-motion y JavaScript desactivado están contemplados en código, pero no fueron emulados en el navegador disponible. Falta validación física en Safari/iPhone, lector de pantalla, y revisión de rendimiento en un celular real. Se tomaron capturas en la conversación; no se guardaron PNG persistentes.
Los botones pueden mostrarse brevemente antes de la hidratación: se prioriza que no queden inaccesibles si JavaScript falla.
El build regenera next-env.d.ts automáticamente; no se editó manualmente.

## Vista previa
http://127.0.0.1:3004/
Para volver a iniciarla desde esta carpeta: npm run dev -- --port 3004
La aplicación de chatgpt-projects no se modificó: los cambios están en la copia de Downloads solicitada.
