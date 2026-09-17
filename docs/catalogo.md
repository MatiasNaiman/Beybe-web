# Carga del catálogo BEYBE

Editar src/data/products.json con los artículos aprobados. La validación ocurre en src/lib/catalog.ts.
No se necesitan cambios en la portada para incorporar más de 120 artículos.

## Estructura (ejemplo exclusivamente documental, no publicado)

```json
{
  "id": "ID-ESTABLE",
  "slug": "nombre-del-articulo",
  "name": "Nombre real del artículo",
  "description": "Descripción aprobada",
  "category": "ropa",
  "images": [
    { "src": "/products/sku-frente.webp", "alt": "Descripción de la foto real" }
  ],
  "variants": [
    {
      "id": "variante-estable",
      "sku": "SKU-REAL",
      "label": "Color y talle",
      "stock": 0,
      "sales": {
        "minorista": { "price": 1000000, "minQuantity": 1, "step": 1 },
        "mayorista": { "price": 800000, "minQuantity": 6, "step": 6 }
      }
    }
  ]
}
```

Los importes del ejemplo son ilustrativos. price se expresa en **centavos de ARS** (1.000.000 = ARS 10.000).
Cada modalidad puede omitirse si el artículo no se vende por ese canal.
minQuantity es la primera cantidad válida; siguientes cantidades = minQuantity + N × step.
stock se expresa en unidades, no en paquetes; máximo por variante 999 unidades para esta base.
Un artículo sin stock permanece visible pero no se puede agregar. IDs, slugs, SKU y variantes deben ser únicos.

Categorías válidas: ajuar, ropa, bano, mantillas, baberos, gorritos.
Guardar fotos definitivas en public/products/. Usar WebP/AVIF con nombre estable y texto alternativo.
Recomendado: 1.200–1.600 px por lado para detalle, varias vistas y misma iluminación/textura aprobada.

## Reemplazar fotos de categorías

Reemplazar el archivo de public/images/categories/ o actualizar la propiedad image en src/data/categories.ts.
Actualizar los textos alternativos en src/data/categories.ts. Una vez que todas sean propias,
retirar las etiquetas “Imagen de referencia” y actualizar /creditos y el registro de licencias.
No usar una imagen provisional como foto de un SKU BEYBE.

## Integración posterior

La interfaz CatalogRepository puede conectarse a base de datos/CMS. Antes de habilitar cobros,
la reserva de stock y la creación de órdenes deben ser atómicas y persistentes.
La cotización actual no reserva inventario. Las políticas comerciales definitivas deben confirmarse.
