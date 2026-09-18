# BEYBE · Rediseño móvil

Fecha: 18 de septiembre de 2026.

## Entorno y recuperación

Trabajo directo sobre `C:/Users/glady/.codex/.chatgpt-projects/g-p-6aa5ca44d2d88191857a6d208f331b57/web`, rama local `codex/demo-store-and-motion`. No se creó otra aplicación. Los cambios están en la copia local y no se enviaron a GitHub ni se desplegaron.

Punto de recuperación local: etiqueta `recovery-before-mobile-redesign-2026-09-18`, commit `49bae1a`. Antes de modificar se conservó además el archivo autogenerado `next-env.d.ts` en `output/BEYBE/06 - Rediseño móvil/next-env-antes.txt`. El build vuelve a generar su referencia de tipos según el modo de ejecución.

## Dirección visual y cambios

- Se conservaron logo SVG histórico, textura B, fotografías provisionales autorizadas, Lora, DM Sans y paleta. La propuesta móvil local y el diseño existente fueron las referencias. Mobbin respondió que necesitaba un plan pago; no se contrataron servicios ni se usaron referencias inaccesibles.
- Header de 68 px en móvil, logo centrado, menú y bolsa a ambos lados; barra institucional compacta. Menú nativo con accesos directos por canal, mínimos, cierre con Escape y ciclo de foco.
- Hero móvil compacto: eslogan a dos líneas, emblema textil junto al título, descripción breve y dos accesos con mínimos. La composición amplia se conserva en escritorio.
- Categorías con fotografías protagonistas y ritmo alternado; primera y última ocupan todo el ancho móvil. Destacados horizontales en celular; historia y mayorista con composiciones propias.
- Catálogo con búsqueda visible, filtros/orden en un panel, chips eliminables y estado en URL. Una columna por debajo de 390 px, dos desde 390 y tres desde 1024, sin reducir nombres a texto diminuto.
- Ficha con imagen, nombre y precio en primer orden; descripción desplegable, variantes reconocibles y control de cantidad con botones. Galería preparada para scroll snap, miniaturas, flechas y teclado cuando el catálogo tenga varias imágenes. Se evitó una barra de compra fija que pudiera tapar controles o avisos en pantallas bajas.
- Bolsa con miniatura, cantidad, subtotal, progreso de mínimo y estados vacíos coherentes. El estado de recotización reserva espacio. Checkout sigue siendo una revisión demostrativa con todos los pagos deshabilitados.
- Entradas suaves GSAP con contenido siempre legible, limpieza mediante contexto y matchMedia. Se retiró el parallax del hero en esta etapa. Movimiento reducido cubierto por CSS y GSAP.

## Organización del código

`globals.css`: tokens, documento, controles compartidos, navegación, footer y páginas informativas. `home.css`: hero y secciones editoriales. `shop.css`: catálogo, ficha, bolsa y checkout, con puntos de corte ordenados. Se reemplazaron reglas móviles duplicadas en lugar de acumular parches al final.

Componentes principales modificados: `header`, `category-grid`, `wholesale-banner`, `product-gallery`, `product-purchase`, `purchase-options`, `product-visual`, `cart`, `hero-motion` y `reveal`. Nuevos: `catalog-controls` y `dialog-focus`. Páginas: portada, catálogo y layout/viewport. No se modificaron precios, stock, catálogo JSON, importador ni reglas de servidor.

## Arquitectura para la siguiente etapa visual

La portada expone `data-story-section="welcome"`, `data-story-section="heritage"` y `data-story-layer="textile"`. Las animaciones narrativas futuras deben vivir en límites cliente propios, con contexto GSAP, limpieza al desmontar y alternativa reduced-motion. No animar el contenedor del documento, ni alterar alturas después de cargar imágenes, ni ocultar acciones comerciales. La mariposa conserva el SVG original; no se reescribió ni se añadió animación narrativa en esta fase.

## Comprobaciones realizadas

- 25 pruebas aprobadas: 15 de dominio y 10 HTTP. Cubren mínimos, stock, canales, presentaciones, precios recalculados, rechazo de datos manipulados y checkout sin pagos.
- TypeScript y build optimizado de Next.js aprobados.
- Las 10 pruebas HTTP también se repitieron contra el build final local: aprobadas. La revisión final de consola no mostró errores de ejecución ni avisos nuevos; el aviso de scroll suave pertenecía al servidor de desarrollo anterior y quedó corregido en el build.
- Navegador real con viewport emulado: portada, catálogo, ficha, bolsa y checkout medidos en 320, 360, 375, 390, 430, 768, 1024 y 1440 px, sin desborde horizontal. Inputs de cantidad a 16 px.
- Inspección visual con capturas de viewport en celular y escritorio: portada, categorías, menú, catálogo, filtros, ficha, selectores, bolsa, estado vacío y checkout. Las mediciones de los ocho anchos no equivalen a una inspección visual exhaustiva en ocho dispositivos reales.
- Filtros de categoría/disponibilidad aplicados y visibles en URL y chips; navegación a ficha y cambio de variante.
- Minorista: un set de prueba por $25.000 bloquea; dos alcanzan $50.000 y permiten revisar. Recarga conserva la bolsa. Eliminación muestra estado vacío.
- Mayorista: un pack de $60.000 bloquea; tres generan un borrador de $180.000 con SKU, variante y nueve unidades. Número de WhatsApp verificado: 5491132051182. No se abrió ni envió el mensaje. Minorista y mayorista permanecen separados.
- Teclado: Escape y devolución de foco, Tab contenido en panel. Panel de filtros desplazable en 740 × 360. Se corrigió el aviso Next.js sobre scroll suave durante navegación mediante `data-scroll-behavior`.
- Revisión visual adicional a 390 px: historia, ayuda, créditos, sección mayorista, búsqueda sin resultados, validación del checkout vacío y página de artículo inexistente. Las bolsas usadas en la comprobación se vaciaron al terminar.

## Límites de esta revisión

No se probaron Safari/iOS ni dispositivos físicos, teclado virtual, VoiceOver, red móvil limitada ni preferencia de movimiento reducido activada en el sistema. Los estilos y ramas de reduced-motion sí fueron revisados. Los ocho ejemplos no contienen fotografías de producto, por lo que el recorrido de galería con varias fotos queda pendiente con el catálogo de imágenes real. No se generó una comparación PNG antes/después guardada en disco; las capturas de inspección se mostraron durante la revisión, y la captura de página completa del navegador presentó errores de ensamblado, por lo que se usaron capturas de viewport.

## Abrir localmente

Con dependencias instaladas: `pnpm dev`. Para evaluar el build: `pnpm build` y luego `pnpm start`. Vista local: http://127.0.0.1:3000. No ejecutar desarrollo y producción simultáneamente sobre el mismo puerto. Los datos siguen siendo demostrativos y reemplazables mediante el importador existente.
