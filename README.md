# Globe Runner

A browser game where you move the yellow globe left and right through gaps in pairs of red side-attached barriers falling from the top of the game area.

## How to play

1. Open `index.html` in a web browser.
2. Select **Start Game**.
3. Use the **Left Arrow** and **Right Arrow** keys to move the player.
4. Steer through the openings between the falling barriers. A collision ends the game.

## Project folders and files

### Project root

- `index.html` — page structure, screen headings, start button, and JavaScript/CSS references.
- `README.md` — game instructions and project overview.

### `js/`

- `main.js` — starts the game, runs the game loop, spawns side barriers every 1.87 seconds with randomly different horizontal lengths, a fixed 70-pixel gap, and 45-pixel margins aligned with the background buildings; the vertical thickness stays fixed at 80 pixels.
- `player.js` — creates the yellow, round player near the bottom of the game area and moves it left or right while keeping it inside the play area; collision detection uses a smaller hitbox so the globe can get closer to barriers.
- `globe.js` — defines the falling gate obstacles, with fixed-thickness bars attached to both sides of the game area that fall at 2 pixels per frame.

### `styles/`

- `style.css` — styles the page, buttons, screens, and portrait game area (300 by 600 pixels), clipping any barrier artwork that extends beyond its edges.

### `images/`

- `a90ddd84-0e38-411e-9099-48d6feb5a997.png` — background image for the game area.
- `d755df37-1681-4665-9cb1-e67a6ab3f00e.png` — player globe image.

## Technologies

The game uses HTML, CSS, and plain JavaScript. There is no build step configured.
