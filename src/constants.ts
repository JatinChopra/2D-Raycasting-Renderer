// grid map
export const GRID = [
  [0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];
export const MAP_SIZE = 800;
export const TILE_SIZE = MAP_SIZE / GRID.length;

// player
export const PLAYER = {
  size: TILE_SIZE * 0.2,
  color: "RED",
  x: TILE_SIZE * 1.5,
  y: MAP_SIZE - TILE_SIZE * 1.5,
  angle: 0, // degrees
  speed: 2,
  angleSpeed: 2,
};
