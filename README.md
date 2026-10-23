# Globe Runner

A browser game where you move the globe left and right through gaps in pairs of barriers falling from the top of the game area.

## How to play

1. Open `index.html` in a web browser.
2. Select **Start Game**.
3. Use the left and right arrow keys to move the player, and press **Space** to jump.
4. Steer through the openings between the falling barriers. A collision, or touching the bottom of the play area, ends the game.

## Project folders and files

### Project root

- `index.html` — page structure, screen headings, start button, and JavaScript/CSS references.
- `README.md` — game instructions and project overview.

### `js/`

- `main.js` — starts the game, runs the game loop, and scales barrier openings and collisions to the play area's width.
- `player.js` — creates a globe that scales to the play area's width, moves it left and right, and lets it jump with Space while staying within the visible frame; touching the bottom of the play area ends the game.
- `enemies.js` — defines falling gate barriers and the side-to-side sweeper enemy.
- `pickup.js` — collectible object (`images/descarga (1).png`) that falls between enemy rows; touching it removes it and adds 10 points to the score.

### `styles/`

- `style.css` — styles the page, buttons, screens, and portrait game area (300 by 600 pixels), clipping any barrier artwork that extends beyond its edges.

### `images/`

- `50542cc8-caf4-4ffd-ada8-f555c68ae277.png` — start screen artwork.
- `354dc84f-f7f5-404c-a75c-e9730b5318e4.png` — game background and frame.
- `76632359-071a-4290-8ae2-e48b4ac8aad2.png` — Game Over artwork.
- `113f8409-a90a-4eb0-be36-a2bd885a7115.png` — player globe.
- `a90f8d0c-6d10-4988-aa90-09df6639a64a.png` — source artwork for all falling barriers.
- `a90f8d0c-6d10-4988-aa90-09df6639a64a-transparent.png` — the same artwork with its baked checkerboard removed for display.

## Technologies

The game uses HTML, CSS, and plain JavaScript. There is no build step configured.
