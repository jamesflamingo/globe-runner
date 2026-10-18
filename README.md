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

- `main.js` — starts the game, runs the game loop, spawns pairs of side-attached barriers with varying lengths and a gap between them, removes them after they pass the bottom, checks collisions, and handles keyboard input.
- `player.js` — creates the yellow, round player near the bottom of the game area and moves it left or right while keeping it inside the play area.
- `globe.js` — defines the falling gate obstacles, with fixed-thickness red rectangular bars attached to both sides of the game area.

### `styles/`

- `style.css` — styles the page, buttons, screens, and portrait game area (300 by 600 pixels), including its background image.

### `images/`

- `ad6ee39d-e5c1-409c-afa3-bc9f827953f6.png` — background image for the game area.
- `d755df37-1681-4665-9cb1-e67a6ab3f00e.png` — player globe image.

## Technologies

The game uses HTML, CSS, and plain JavaScript. There is no build step configured.
