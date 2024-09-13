import { rayHitPoint } from "./types";

// fov and angles
export const RAYS = 10;
export const FOV = 75;
export const START_ANGLE = -(FOV / 2);
export const ANGLE_STEP = FOV / (RAYS - 1);

// grid map
export const GRID = [
  [1, 1, 1, 3, 3],
  [1, 0, 0, 0, 1],
  [1, 0, 2, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];
export const MAP_SIZE = 800;
export const TILE_SIZE = MAP_SIZE / GRID.length;
export const CELL_COLOR = {
  1: "red",
  2: "blue",
  3: "green",
};
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

// scene map
export const SCENE_SIZE = 800;
