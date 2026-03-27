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

## Portadas de juegos

Cada juego debe registrar una portada en su manifiesto.

Flujo recomendado:

1. Definir `coverImagePath` apuntando al archivo final esperado, por ejemplo `public/assets/games/<game-slug>/cover.png`.
2. Si el arte final todavia no existe, definir `coverPlaceholderPath` apuntando a un placeholder estable, por ejemplo `public/assets/games/<game-slug>/cover-placeholder.svg`.
3. Cuando tengas el arte final, solo reemplazas o agregas el archivo real en la misma ruta de `coverImagePath` sin tocar el catalogo.

Regla de assets:

- La portada final y el placeholder viven dentro de `public/assets/games/<game-slug>/`.
- El catalogo y la vista del juego deben seguir funcionando aunque solo exista el placeholder.
