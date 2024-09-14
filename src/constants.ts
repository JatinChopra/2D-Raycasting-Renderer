import { rayHitPoint } from "./types";

// fov and angles
export const RAYS = 180;
export const FOV = 75;
export const START_ANGLE = -(FOV / 2);
export const ANGLE_STEP = FOV / (RAYS - 1);

export const GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

export const MAP_SIZE = 400;
export const TILE_SIZE = MAP_SIZE / GRID.length;
export const CELL_COLOR = {
  1: "red",
  2: "blue",
  3: "green",
  4: "yellow",
  5: "pink",
  6: "cyan",
  7: "brown",
  8: "orange",
};
// player
export const PLAYER = {
  size: TILE_SIZE * 0.2,
  color: "RED",
  x: TILE_SIZE * 1.5,
  y: MAP_SIZE - TILE_SIZE * 1.5,
  angle: 0, // degrees
  speed: MAP_SIZE * (4.5 / 800),
  angleSpeed: 5,
  dir: { x: 1, y: 0 }, // Direction vector
  plane: { x: 0, y: 0.66 }, // Camera plane
};

// scene map
export const SCENE_SIZE = 800;
export const STRIP_WIDTH = SCENE_SIZE / RAYS;
