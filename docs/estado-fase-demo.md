# BEYBE · Estado guardado de la fase demostrativa
Fecha: 18 de septiembre de 2026.

## Implementado
- Continuación de la aplicación existente Next.js/React/TypeScript, conservando logo, imágenes de categorías y fondo textil B.
- 8 artículos ficticios, 6 categorías, variantes y SKU, precios en centavos por canal y presentación, unidades/packs/docenas/surtidos, artículos agotados y exclusivos mayoristas.
- Catálogo con categoría, búsqueda por nombre/código, disponibilidad y orden por precio/nombre.
- Fichas, cantidades, presentaciones, bolsas separadas persistentes, actualización y eliminación.
- Servidor recalcula precios y valida mínimos ARS50.000/ARS150.000, incrementos y stock físico compartido entre presentaciones.
- Borrador mayorista a +54 9 11 3205-1182 con identificación explícita de prueba, códigos, variantes, cantidades, presentación y total. No se enviaron mensajes.
- Revisión minorista de pedido con validación en servidor. No crea órdenes ni reservas ni cobros; Mercado Pago, transferencia y efectivo deshabilitados.
- Paleta crema/verde agua/durazno, eslogan Vistiendo al futuro, placeholders propios de interfaz, motion GSAP/ScrollTrigger con reduced motion y transiciones CSS.
- Capa CatalogRepository desacoplada. Importador JSON con validación y respaldo previo.

## Carga posterior
El catálogo está en src/data/products.json. No se editan componentes por artículo.
1. Preparar un JSON con la misma estructura. Mantener IDs permanentes; todos los datos de esta entrega son demo=true.
2. Para catálogo real, reemplazar el conjunto por productos con demo=false; no mezclar reales y ficticios.
3. Precio entero en centavos por presentación; stock en unidades físicas de la variante. quantity cuenta presentaciones, units indica cuántas unidades contiene cada una.
4. Las imágenes van en public/products/ y el JSON referencia /products/nombre.webp (también PNG/JPG/AVIF). images=[] usa un placeholder.
5. Validar: pnpm catalog:validate ruta/al/catalogo.json
6. Importar: pnpm catalog:import ruta/al/catalogo.json --apply
7. Reiniciar desarrollo o recompilar. El importador guarda una copia anterior en .catalog-backups/, excluida de Git.

Los surtidos de esta etapa son fijos, con un stock propio por variante; no son combinaciones dinámicas tomadas de stocks de otros SKU.
Sin opciones: usar una variante con options={} y su SKU. availability puede ser available (stock numérico obligatorio), unavailable o on_request (solo mayorista, pendiente de confirmación).
No hay base de datos ni panel administrativo visual. El importador funciona localmente para el responsable técnico. Un futuro panel autenticado puede escribir mediante un adaptador del repositorio.

## Evidencia de pruebas hasta el checkpoint
- 15 pruebas de dominio y 10 pruebas HTTP aprobadas.
- TypeScript sin errores.
- Build de producción aprobado; importador ejecutado correctamente y ocho artículos validados después de corregir la ejecución TypeScript.
- Navegador: categoría → ficha → color/talle → pack → bolsa minorista; ARS47.000 bloqueado y ARS70.500 habilita revisión; recarga conserva bolsa; eliminar vuelve al estado vacío.
- Navegador: mayorista surtido con incremento 2; cantidad 3 bloqueada; ARS144.000 bloqueado; ARS216.000 genera borrador correcto sin enviar.
- Checkout: pago deshabilitado y ambos canales separados.
- Figma revisado en navegador; get_design_context bloqueado por cuota Starter. Se usó el diseño existente y sus archivos locales.
- Recuperación en GitHub: recovery/before-demo-store-2026-09-18.

## Pendiente antes de dar esta fase por cerrada
- Completar revisión responsive final en 320, 768, 1024 y 1440 px, consola limpia sobre compilación final y accesibilidad básica.
- Actualizar documentación anterior que todavía describe el catálogo vacío.
- Revisar presentación final y cualquier ajuste que surja. No se desplegó en producción.

## Próximas fases, fuera de esta entrega
Panel administrativo autenticado/base de datos, catálogo y fotos oficiales, órdenes persistentes y reserva transaccional de stock, checkout seguro y webhooks verificados, envío, políticas comerciales y despliegue autorizado.

## Ejecución
pnpm install
pnpm dev
pnpm test
pnpm test:integration (requiere servidor en http://127.0.0.1:3000; TEST_BASE_URL permite otro origen)
pnpm typecheck
pnpm build

Documentación GSAP usada: https://gsap.com/resources/React/ y https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
