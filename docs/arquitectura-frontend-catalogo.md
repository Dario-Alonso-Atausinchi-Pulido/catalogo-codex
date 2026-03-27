# Arquitectura Frontend del Catalogo

## Objetivo

Dejar una base clara y escalable para un catalogo de minijuegos arcade en Angular, TypeScript y HTML Canvas, sin generar todavia juegos concretos.

## Jerarquia base

```text
src/
  app/
    core/
      config/
      services/
    shared/
      ui/
    layout/
      shell/
    catalog/
      pages/
      components/
    games/
      engine/
        components/
        models/
      library/
        game-library.registry.ts
        game-library.routes.ts
        <game-slug>/
          config/
          models/
          pages/
          scenes/
          services/
          ui/
          <game-slug>.manifest.ts
          <game-slug>.routes.ts

public/
  assets/
    global/
      images/
      icons/
      backgrounds/
      audio/
      data/
    games/
      <game-slug>/
        sprites/
        backgrounds/
        audio/
        ui/
        data/
```

## Capas y responsabilidades

`core/`
Configuraciones de aplicacion y servicios singleton que sirven a todo el catalogo.

`shared/`
Componentes UI reutilizables que no pertenecen a un juego puntual ni al layout principal.

`layout/`
Shell principal: cabecera, navegacion, footer y punto de montaje para las features.

`catalog/`
Paginas y componentes del catalogo. Esta capa no debe conocer detalles internos de la implementacion de cada juego.

`games/engine/`
Base reutilizable para juegos canvas: contratos, componentes host y modelos compartidos.

`games/library/`
Registro central de juegos y, a futuro, las carpetas independientes de cada juego.

## Convencion para agregar un nuevo juego

1. Crear la carpeta `src/app/games/library/<game-slug>/`.
2. Crear dentro de esa carpeta:

```text
<game-slug>/
  config/
  models/
  pages/
  scenes/
  services/
  ui/
  <game-slug>.manifest.ts
  <game-slug>.routes.ts
```

3. Crear los assets del juego en `public/assets/games/<game-slug>/`.
4. Registrar el manifiesto del juego en `src/app/games/library/game-library.registry.ts`.
5. Agregar las rutas del juego en `src/app/games/library/game-library.routes.ts`.
6. Importar dependencias solo desde `core`, `shared`, `games/engine` o desde la propia carpeta del juego.

## Regla de aislamiento

Un juego no debe importar codigo desde otro juego.

Si `memory-cards` necesita una utilidad compartida con `endless-runner`, esa utilidad se mueve a `shared/` o a `games/engine/`.

## Estructura interna recomendada por juego

`config/`
Constantes, dificultad, balance, tamanos de canvas y banderas del juego.

`models/`
Tipos propios del juego: entidades, estado, eventos y DTO internos.

`pages/`
Componentes Angular contenedores del juego, por ejemplo la pagina que monta el canvas y la UI de alto nivel.

`scenes/`
Escenas del juego, control de flujo y orquestacion de gameplay.

`services/`
Servicios especificos del juego, por ejemplo input, audio o persistencia local.

`ui/`
HUD, overlays, menu de pausa y componentes visuales propios del juego.

## Mapeo de assets

Recursos globales:

`public/assets/global/images/`
Imagenes compartidas del catalogo.

`public/assets/global/icons/`
Iconos globales de navegacion, marca o UI transversal.

`public/assets/global/backgrounds/`
Fondos o texturas usados por el shell o por paginas globales.

`public/assets/global/audio/`
Audio global del catalogo. Solo usar si no pertenece a un juego especifico.

`public/assets/global/data/`
JSON o data compartida por el catalogo.

Recursos por juego:

`public/assets/games/<game-slug>/sprites/`
Spritesheets, frames y atlas del juego.

`public/assets/games/<game-slug>/backgrounds/`
Fondos y capas visuales exclusivas del juego.

`public/assets/games/<game-slug>/audio/`
Musica y efectos de sonido del juego.

`public/assets/games/<game-slug>/ui/`
HUD, botones, overlays y portada usada por el catalogo para ese juego.

`public/assets/games/<game-slug>/data/`
Configuracion serializada, mapas, tablas o JSON del juego.

## Nomenclatura

Regla principal:

Usar `kebab-case` para carpetas, archivos, slugs, rutas y nombres de assets.

Ejemplos validos:

`game-01`
`game-02`
`endless-runner`
`memory-cards`
`catalog-page.component.ts`
`game-library.registry.ts`
`arcade-cover.png`

Clases, interfaces y componentes Angular:

Usar `PascalCase`.

Ejemplos:

`CatalogPageComponent`
`GameCatalogService`
`GameManifest`
`CanvasStageComponent`

Sufijos obligatorios:

`*.component.ts`
`*.service.ts`
`*.model.ts`
`*.config.ts`
`*.manifest.ts`
`*.routes.ts`

## Registro de un juego nuevo

Cada juego debe exponer un manifiesto parecido a este:

```ts
export const MEMORY_CARDS_MANIFEST: GameManifest = {
  order: 10,
  slug: 'memory-cards',
  title: 'Memory Cards',
  summary: 'Juego de memoria por rondas.',
  routePath: '/games/memory-cards',
  status: 'prototype',
  tags: ['memory', 'cards', 'arcade'],
  assetsBasePath: 'assets/games/memory-cards',
  canvas: {
    width: 1280,
    height: 720,
    pixelArt: false
  },
  coverImagePath: 'assets/games/memory-cards/cover.png',
  coverPlaceholderPath: 'assets/games/memory-cards/cover-placeholder.svg'
};
```

## Regla de portadas y placeholders

Cada juego nuevo debe registrar una portada reemplazable.

Convencion recomendada:

- Archivo final esperado: `public/assets/games/<game-slug>/cover.png`
- Placeholder inicial: `public/assets/games/<game-slug>/cover-placeholder.svg`

Flujo:

1. El manifiesto apunta `coverImagePath` al archivo final esperado.
2. Si ese archivo todavia no existe, el manifiesto define `coverPlaceholderPath`.
3. El catalogo y la vista del juego usan el placeholder como fallback sin romper la UI.
4. Cuando exista arte final, basta con colocar `cover.png` en la misma carpeta del slug.

Regla importante:

La portada, su placeholder y cualquier recurso visual del juego deben vivir dentro de `public/assets/games/<game-slug>/`.

## Cosas que no se deben hacer

No guardar sprites de un juego en `public/assets/global/`.

No crear imports cruzados entre carpetas de juegos.

No meter configuracion de un juego dentro de `core/`.

No usar nombres como `nuevo`, `test2`, `img1` o variantes ambiguas.

No registrar rutas del juego dentro de componentes del catalogo.

No mezclar HUD o escenas de un juego con UI compartida del catalogo.

## Flujo recomendado por episodio

1. Crear slug del juego.
2. Crear carpeta del juego.
3. Crear assets del juego.
4. Crear manifiesto y rutas.
5. Montar pagina Angular del juego sobre el engine canvas.
6. Registrar el juego en el catalogo.

Con esta regla, cada episodio agrega una unidad nueva sin desordenar las anteriores.
