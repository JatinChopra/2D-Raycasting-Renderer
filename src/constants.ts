// fov and angles
export const RAYS = 180;
export const FOV = 75;
export const START_ANGLE = -(FOV / 2);
export const ANGLE_STEP = FOV / (RAYS - 1);

export const GRID: number[][] = [
  //
  [2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 2, 1, 0, 7, 7, 0, 0, 7, 7, 1, 0, 1, 0, 1],
  [2, 0, 2, 0, 0, 7, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1],
  [5, 0, 5, 0, 0, 7, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1],
  [5, 0, 5, 6, 6, 7, 0, 0, 0, 0, 8, 1, 1, 2, 2, 1],
  [5, 0, 6, 0, 0, 7, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1],
  [5, 0, 0, 0, 0, 7, 0, 10, 10, 0, 0, 0, 0, 0, 0, 1],
  [5, 4, 5, 3, 7, 3, 3, 4, 4, 3, 3, 0, 0, 0, 0, 1],
  [3, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 1, 1, 1, 0, 1],
  [2, 0, 2, 2, 7, 4, 0, 4, 4, 7, 4, 2, 2, 2, 0, 2],
  [2, 0, 0, 0, 2, 4, 0, 0, 0, 0, 4, 2, 0, 0, 0, 2],
  [2, 0, 0, 0, 2, 4, 0, 0, 0, 0, 4, 2, 0, 0, 0, 2],
  [2, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 4, 4, 9, 9, 4, 4, 2, 2, 2, 2, 2],
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
  9: "blue",
  10: "blue",
};

const { x, y } = getPlayerStartPosition(GRID);

// player
export const PLAYER = {
  size: TILE_SIZE * 0.2,
  color: "RED",
  x: x,
  y: y,
  angle: 0, // degrees
  speed: MAP_SIZE * (2.4 / 800),
  angleSpeed: 2.5,
};

// scene map

export let SCENE_SIZE = 800;
export let STRIP_WIDTH = SCENE_SIZE / RAYS;

function getPlayerStartPosition(grid: number[][]): { x: number; y: number } {
  const height = grid.length;
  const width = grid[0].length;

  const startLeft = Math.random() < 0.5;

  let x: number, y: number;

  for (y = height - 2; y >= 0; y--) {
    x = startLeft ? 1 : width - 2;

    if (grid[y][x] === 0) {
      return {
        x: (x + 0.5) * TILE_SIZE,
        y: (y + 0.5) * TILE_SIZE,
      };
    }
  }

  return {
    x: startLeft ? 1.5 * TILE_SIZE : (width - 1.5) * TILE_SIZE,
    y: (height - 1.5) * TILE_SIZE,
  };
}
