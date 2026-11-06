# cubix-games_marcus
Cubix games creates good games

# Be a White Blood Cell

A low-poly 3D survival game. Defend the body, collect DNA, upgrade your cell, and travel between organs.

## Play locally

Run `python3 -m http.server 8000` from this folder, then open `http://localhost:8000/` in a browser. Progress is stored in that browser.

## Controls

- WASD or arrow keys: move
- Space: fire
- Shift: dodge
- E: squeeze through vessel walls
- Q: immune pulse
- R: reproduce helper cells
- U: evolution screen

Use **My cell** to upgrade the vacuole and mitochondria.

## Tests

Run `node --test tests/*.test.mjs` with Node.js.

The game uses the Three.js library included in `dist/three.js` (MIT license; see `dist/THREE-LICENSE.txt`).
