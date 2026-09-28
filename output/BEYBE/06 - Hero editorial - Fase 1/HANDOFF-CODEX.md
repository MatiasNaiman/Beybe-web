# BEYBE — Handoff definitivo del hero full-width y secuencia pinned

**Estado:** propuesta de diseño pendiente de aprobación explícita. Este archivo no autoriza implementación, push ni deploy. Codex debe esperar la aprobación visual del usuario.

## 1. Alcance

Modificar posteriormente solo el hero de inicio y su transición inmediata a Colecciones. Mantener intactos header, logo completo del header, catálogo, productos, precios, stock, mínimos comerciales, carritos, validaciones, checkout y pagos.

La secuencia debe usar el scroll nativo con un pin breve. No usar snapping, wheel hijacking ni desplazamiento artificial. La reversa debe surgir de la misma timeline con `scrub`.

## 2. Assets

- Desktop: `sources/fotoBebesAcostada.jpg`.
- Mobile: `sources/fotoBebeMovil.jpg`.
- Logo del header: conservar el asset actual sin cambios.
- Isotipo articulado aprobado/pending: `output/BEYBE/06 - Hero editorial - Fase 1/butterfly-articulated.svg`.
- Referencia visual: `output/BEYBE/06 - Hero editorial - Fase 1/hero-direction.html`.
- Tipografías: Lora y DM Sans existentes.
- Colores principales: verde `#29483D`, verde agua histórico `#89C1A8`, crema y durazno actuales.

No editar los originales de `sources/`. Al implementar, generar versiones AVIF/WebP optimizadas y conservar fallback. El navegador debe descargar una sola orientación; usar `<picture>` o una solución equivalente que elija la fuente por media query.

## 3. Estructura visual desktop

1. Header existente.
2. Aviso de tienda demostrativa existente.
3. Hero de ancho `100vw`, sin tarjeta, borde, radio ni margen lateral.
4. Fotografía horizontal absoluta como fondo visual.
5. Capa de gradiente muy sutil.
6. Bloque HTML de título y descripción en la zona derecha.
7. Dos CTAs independientes que se revelan durante el pin.
8. Mariposa decorativa articulada sobre la fotografía.
9. Puente visual hacia Colecciones después del unpin.

El título, descripción, CTAs y mínimos deben seguir siendo HTML accesible. Ningún texto forma parte de la imagen.

### Fotografía desktop

- `object-fit: cover`.
- `object-position: 50% 50%` como base.
- Proporción visual objetivo del hero: aproximadamente 2.05:1 a 2.25:1.
- Altura recomendada: `clamp(560px, 64svh, 720px)`, validada contra el header real.
- Nunca recortar rostros, manos, prendas o etiquetas BEYBE.
- Zona de bebés protegida aproximada: `x 0–54%`, `y 15–95%`.
- Zona editorial de texto: `x 65–95%`, `y 22–78%`.
- Corredor de vuelo: `x 86–98%`, desde fuera del borde superior hasta `y 70%`. El recorrido permanece en la zona luminosa y ahora cruza deliberadamente el extremo derecho del bloque editorial. La mariposa se renderiza por encima del texto durante un tramo breve; el tamaño, contraste y duración deben permitir seguir leyendo.

### Gradiente desktop

Aplicar sobre la fotografía, sin placa rectangular:

- 0–43% del ancho: transparente.
- 43–58%: transición casi imperceptible.
- 58–74%: crema con opacidad aproximada `0.08 → 0.58`.
- 74–100%: crema con opacidad aproximada `0.58 → 0.92`.

El gradiente no debe lavar la ropa ni alterar el color aparente de los bebés.

### Texto desktop

- Contenedor: `left 65%`, ancho aproximado `29%` y máximo `420px`, centro vertical cercano al 48% del hero. El texto comparte el extremo derecho con el recorrido de la mariposa.
- Título: “Vistiendo al futuro.” en Lora, verde profundo, `clamp(56px, 5.2vw, 82px)`, line-height `0.96–1`.
- Descripción convertida en un bloque editorial de dos niveles. Primera línea “Ropa y textiles para bebés” en Lora Medium, 18–20 px, verde profundo y line-height 1.3. Segunda línea “Fabricación propia · desde 1998” en DM Sans Bold, 10–11 px, mayúsculas, tracking 0.13–0.15 em y verde grisáceo. No usar el párrafo corrido anterior.
- No mover el texto durante la secuencia pinned.

## 4. CTAs y estado inicial

En la carga inicial:

- Fotografía, título y descripción visibles.
- Mariposa completamente invisible y fuera de escena.
- CTAs con `opacity: 0`, `visibility: hidden` y `translateY(12px)`; deben conservar su espacio o resolverse sin producir salto de layout.

CTAs:

- Disponer ambos CTAs en una sola fila, con una separación visible de 20–28 px.
- Primario: “Comprar para mi bebé” o el texto vigente del canal minorista; fondo verde profundo y texto blanco o crema claro.
- Secundario: “Comprar mayorista”; fondo transparente, borde verde profundo y texto verde.
- Alto visual desktop: 38–42 px.
- Bordes completamente redondeados (`border-radius: 999px`), con una silueta fina y horizontal.
- Flecha simple al extremo derecho, sin círculo, sombra ni superficie crema.
- Respetar destinos actuales y mínimos comerciales actuales.
- Animación: solo opacity y transform; sin rebote.

## 5. Pin y duración

Usar una timeline GSAP/ScrollTrigger con `pin: true`, `scrub` moderado e `invalidateOnRefresh: true`.

- Desktop: longitud inicial recomendada `0.95 × viewport height`; rango aceptable tras revisión visual `0.8–1.1vh`.
- Mobile: longitud inicial recomendada `0.55 × viewport height`; rango aceptable `0.42–0.65vh`.
- El pin termina únicamente después de que ambos CTAs estén completamente visibles y la mariposa esté completamente oculta.
- No agregar pin spacing excesivo ni un vacío perceptible antes de Colecciones.
- El último 10% estabiliza el hero para que el unpin no se sienta abrupto.

## 6. Timeline desktop: 0–100% del tramo pinned

- **0–8%:** estado inicial. Mariposa fuera de escena y `opacity: 0`. CTAs ocultos.
- **8–26%:** entrada de mariposa. `opacity 0 → 1`, escala `0.84 → 0.98`.
- **18–40%:** aparece CTA minorista. `opacity 0 → 1`, `translateY 12px → 0`.
- **26–74%:** vuelo principal.
- **34–56%:** aparece CTA mayorista con el mismo gesto.
- **72–90%:** fade de mariposa. `opacity 1 → 0`, escala `1.02 → 0.90`; blur máximo opcional 2 px.
- **90–100%:** ambos CTAs completos, mariposa oculta, composición estable.
- **100%:** liberar pin y continuar a Colecciones.

Al subir, esta misma timeline debe retroceder de forma continua. No crear una segunda animación ni saltar entre estados.

## 7. Trayectoria desktop recalculada

Coordenadas relativas al rectángulo visible de la fotografía:

1. Oculta: `x 88%`, `y -8%`.
2. Entrada: `x 91%`, `y 8%`.
3. Primer cambio: `x 86%`, `y 18%`.
4. Segundo cambio: `x 93%`, `y 30%`.
5. Tercer cambio: `x 88%`, `y 44%`.
6. Descenso: `x 92%`, `y 58%`.
7. Fade: `x 90%`, `y 70%`.

La curva conserva el mismo ritmo ondulado y el mismo corredor luminoso. Atraviesa intencionalmente la porción derecha del título, la descripción y el área de CTAs. Mantener el cruce breve y usar `z-index` superior para que se perciba como un vuelo por delante; nunca detener la mariposa sobre una palabra o acción. El centro no debe superar `x 96%`.

Usar MotionPathPlugin solo si ya está disponible con la licencia/configuración del proyecto. En caso contrario, reproducir el path con puntos relativos y tweens GSAP encadenados. No añadir una dependencia o coste para esta función.

Orientación global: acompañar la tangente con rotación limitada a `−9° … +9°`; no dejar que `autoRotate` produzca giros completos.

## 8. Tamaño desktop

Medir el ancho renderizado respecto al ancho visible del hero:

- Entrada: `6.2%` del ancho; escala global aproximada `0.84`.
- Crucero: `6.8%` nominal.
- Máximo: `7.4%` en el centro del recorrido; escala `1.08`.
- Fade: `6.4%`; escala `0.90`.
- Referencia a 1440 px: aproximadamente 89–107 px.

El isotipo debe ser reconocible y conservar protagonismo secundario frente a los bebés.

## 9. Mobile

Usar exclusivamente `fotoBebeMovil.jpg`.

- Fotografía: `object-fit: cover`, `object-position: 50% 48%`.
- Imagen primero; título, descripción y CTAs debajo para no tapar rostro ni prenda.
- Altura fotográfica orientativa a 390 px: 350–390 px, adaptada a la altura disponible.
- El pin incluye fotografía y contenido del hero como una sola escena, pero su duración debe ser breve.
- Superficie táctil de CTAs mínima 44 px; objetivo 48 px.
- Repetir el bloque editorial de dos niveles de desktop, ajustado a 14–16 px para la línea principal y 8–9 px para la línea histórica.
- CTAs móviles en una sola fila con separación de 12–16 px. Primario verde sólido y secundario transparente delineado, extremos completamente redondeados y flecha simple. Alto visual 36–40 px, conservando un área interactiva mínima de 44 px mediante el contenedor. Sin fondo crema ni sombra.

### Timeline mobile

- **0–10%:** mariposa y CTAs ocultos.
- **10–24%:** entrada de mariposa.
- **18–36%:** CTA minorista.
- **24–62%:** vuelo breve.
- **32–50%:** CTA mayorista.
- **62–78%:** fade de mariposa.
- **78–100%:** acciones completas, mariposa invisible y preparación de unpin.

### Trayectoria mobile

Coordenadas relativas a la fotografía vertical:

1. Oculta: `x 100%`, `y -6%`.
2. Entrada: `x 92%`, `y 10%`.
3. Primera curva: `x 96%`, `y 26%`.
4. Segunda curva: `x 91%`, `y 43%`.
5. Fade: `x 94%`, `y 58%`.

Mantener el centro del isotipo en el extremo derecho luminoso. Se admite un recorte leve del ala exterior durante un giro, pero nunca cruzar gorrito, rostro, torso, manos ni texto.

### Tamaño mobile

- Entrada: `17%` del ancho visible de la fotografía.
- Máximo: `20%`.
- Fade: `17.5%`.
- Referencia a 390 px: aproximadamente 62–74 px.

## 10. SVG articulado

El archivo `butterfly-articulated.svg` conserva el trazado original completo como definición y lo reconstruye mediante tres grupos recortados:

- `#left-wing`
- `#body`
- `#right-wing`
- Wrapper común: `#butterfly`

La silueta en reposo debe compararse visualmente contra `web/public/brand/butterfly.svg`. No modificar el original de producción hasta la implementación aprobada.

Pivotes sugeridos dentro del viewBox original `353 3 276 226`:

- Ala izquierda: `480 106`.
- Ala derecha: `500 106`.

Antes de producir, comprobar que no aparezcan líneas, huecos o solapamientos visibles al aplicar transforms. Si el clipping necesita ajuste, modificar solo los límites de las máscaras, nunca el path histórico.

## 11. Aleteo

Separar transformaciones:

- Wrapper exterior `#butterfly`: motion path, posición, rotación tangencial y escala de profundidad.
- `#left-wing` y `#right-wing`: aleteo independiente.
- `#body`: permanece estable respecto del wrapper.

Rango recomendado:

- Ala izquierda: equivalente visual de `0° → −7° → 0°` o `scaleX 1 → 0.92 → 1` desde su pivote.
- Ala derecha: `0° → +6° → 0°` o `scaleX 1 → 0.93 → 1`.
- Frecuencia: `1.3–1.6 ciclos/s` mientras está visible.
- Desfase entre alas: `6–10%` del ciclo.
- Easing: `sine.inOut`.
- Reducir amplitud durante entrada y fade.

No combinar el aleteo interno con la rotación global en el mismo nodo. Pausar o destruir el loop cuando la mariposa sea invisible, esté fuera del viewport o la pestaña no esté visible.

## 12. Fade, unpin y Colecciones

- Comenzar fade de mariposa alrededor del 72% desktop / 62% mobile.
- Terminar fade antes del 90% desktop / 78% mobile.
- Cuando el pin se libera, la mariposa debe tener `opacity: 0` y no interceptar eventos (`pointer-events: none`, `aria-hidden: true`).
- Colecciones entra mediante el scroll natural inmediatamente después del tramo estable.
- No trasladar la mariposa a la sección Colecciones en esta fase.

## 13. `prefers-reduced-motion`

Con `prefers-reduced-motion: reduce`:

- Mariposa oculta durante toda la experiencia.
- Sin recorrido, aleteo, zoom o profundidad fotográfica.
- No usar pin prolongado. Preferencia: desactivar el pin completamente.
- Mostrar ambos CTAs desde el inicio; se permite una transición mínima no ligada al scroll si no retrasa el acceso.
- Colecciones debe seguir inmediatamente después del hero.

Todo el contenido y las acciones deben ser accesibles aunque JavaScript falle.

## 14. Limpieza GSAP/ScrollTrigger

- Usar `gsap.context()` o el patrón de limpieza vigente del proyecto.
- Destruir timeline, ScrollTrigger, motion path y loop de alas al desmontar.
- Revertir estilos inline generados por GSAP.
- `invalidateOnRefresh: true` y recálculo de puntos después de imágenes, resize y orientation change.
- Separar configuraciones desktop/mobile con `gsap.matchMedia()`.
- Evitar múltiples triggers activos después de navegar y volver.
- Verificar restauración de scroll, navegación atrás/adelante y hot reload.
- Animar transform y opacity. Limitar blur al fade final y omitirlo en equipos de bajo rendimiento.

## 15. Validación requerida

- Revisar 320, 360, 375, 390, 430, 768, 1024 y 1440 px.
- Capturar 0%, 25%, 50%, 75% y 100% del pin en desktop y mobile.
- Confirmar que el hero toca ambos bordes del viewport.
- Confirmar que solo se descarga la imagen apropiada.
- Confirmar ausencia de saltos cuando aparecen CTAs.
- Confirmar que la mariposa no cruza zonas protegidas.
- Confirmar reversa fluida.
- Confirmar unpin corto y natural.
- Probar reduced motion en un navegador real.
- Ejecutar lint, TypeScript, pruebas existentes y build cuando se implemente.

## 16. Condición de aprobación

No implementar en la aplicación hasta que el usuario apruebe explícitamente la propuesta de `hero-direction.html`. Las anotaciones, curvas, puntos, zonas punteadas y mariposas repetidas del tablero son documentación y no deben aparecer en producción.


