# BEYBE · Web propia

Implementación del diseño aprobado en Figma, con el logo corregido y el fondo B (textil sutil).
Referencia visual: https://www.figma.com/design/2N66QVxjrut0ChOeog2Xvo?node-id=11-373
Portada móvil: nodo 11:466. Tipografías Lora y DM Sans, servidas localmente.

## Desarrollo

Requiere Node.js 24 LTS y pnpm 11 (utilizado: 11.19.0).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

Abrir http://localhost:3000. Copiar `.env.example` a `.env.local` para configurar el WhatsApp comercial.
El número debe contener únicamente dígitos, país y área. No hay números ni credenciales inventados.
Si el lanzador de pnpm del entorno fuerza reinstalaciones, los equivalentes directos son:
`node --import tsx --test tests/*.test.ts`, `node node_modules/typescript/bin/tsc --noEmit`,
`node node_modules/next/dist/bin/next build` y `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1`.

## Alcance implementado

- Portada fiel a la composición de Figma, logo SVG real, textura aprobada y seis imágenes CC0 provisionales.
- Adaptación a celular, tablet y escritorio; navegación móvil con diálogo nativo, foco y Escape.
- Categorías, búsqueda mediante URL, modalidad de compra y página de producto por variante.
- Bolsa persistente por modalidad con cantidades, eliminación y cotización recalculada en servidor.
- Mínimo minorista ARS 50.000; mayorista ARS 150.000.
- Solicitud mayorista por WhatsApp, disponible solo con teléfono válido, artículos y mínimo alcanzado.
- Páginas historia, ayuda, créditos; estados vacíos, errores, carga y página no encontrada.
- Imágenes optimizadas y fuentes locales. Animaciones moderadas y respeto por movimiento reducido.

## Catálogo real e imágenes

`src/data/products.json` está vacío intencionalmente: faltan los SKU, precios, variantes y stock autorizados.
Las imágenes de categorías no son fichas de productos ni se presentan como artículos BEYBE.
Ver [carga del catálogo](docs/catalogo.md) y [licencias](docs/imagenes.md).
La estructura admite más de 120 artículos; no hay límite de 50 ni artículos ficticios publicados.
Los datos de prueba existen únicamente en `tests/`.

## Arquitectura

Next.js App Router + React + TypeScript. Renderizado en servidor por defecto y componentes de cliente para
interacciones. CSS con variables de diseño. Sin plataforma de tienda ni dependencia de un hosting específico.

`CatalogRepository` en `src/lib/catalog.ts` concentra el acceso al catálogo; hoy lee JSON validado por Zod.
Puede reemplazarse por una base de datos/CMS conservando las páginas. Las imágenes de categorías se cambian
por archivo y las de artículos desde el catálogo.

La bolsa guarda solo IDs y cantidades. `POST /api/quote` consulta precios y stock del catálogo en el servidor.
No crea pedidos, no reserva stock ni cobra. WhatsApp abre un borrador que el cliente revisa y envía.

## Pendiente antes de vender

1. Cargar y validar el catálogo real y fotografías BEYBE; confirmar reglas de paquetes mayoristas.
2. Configurar teléfono comercial, datos del negocio, logística, términos, privacidad y política de cambios.
3. Elegir persistencia de pedidos/inventario y administración del catálogo con la propietaria.
4. Implementar checkout: orden duradera, recotización final, reserva de stock, idempotencia y webhooks
   autenticados de Mercado Pago. Transferencia y efectivo requieren validación y conciliación.
5. Pruebas de integración en sandbox, dominio/hosting y autorización de publicación.
6. Retirar `robots: noindex` solo cuando la tienda esté lista.

El contrato de pagos está preparado en `src/lib/payments.ts`; **ningún medio de pago está integrado ni habilitado**.
No se ha publicado la tienda ni contratado servicios. No hay datos personales, secretos ni tokens en este repositorio.
# Estado actual

La fase de catálogo demostrativo y carritos está implementada. Ver [estado y pasos para retomar](docs/estado-fase-demo.md), incluyendo pruebas y pendientes. Las notas anteriores sobre catálogo vacío describen la primera entrega.
