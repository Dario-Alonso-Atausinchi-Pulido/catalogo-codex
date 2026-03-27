# Catalogo Arcade

Base frontend para un catalogo escalable de minijuegos arcade construido con Angular, TypeScript y HTML Canvas.

## Scripts

```bash
npm start
npm run build
npm test
```

## Arquitectura

La guia principal de trabajo esta en [docs/arquitectura-frontend-catalogo.md](docs/arquitectura-frontend-catalogo.md).

## Estructura resumida

```text
src/app/
  core/
  shared/
  layout/
  catalog/
  games/

public/assets/
  global/
  games/
```

## Regla base

Cada juego nuevo debe entrar como una unidad independiente dentro de `src/app/games/library/<game-slug>/` y sus assets deben vivir en `public/assets/games/<game-slug>/`.
