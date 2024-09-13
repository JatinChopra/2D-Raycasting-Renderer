import p5 from "p5";

// import constants
import { GRID, MAP_SIZE, TILE_SIZE, PLAYER } from "../constants";

export function sketchMap(p: p5) {
  // helper functions for drawing grid , casting rays and all

  function drawGrid() {
    for (let row = 0; row < GRID.length; row++) {
      for (let col = 0; col < GRID[row].length; col++) {
        p.stroke(255);
        p.noFill();
        if (GRID[row][col] > 0) {
          p.fill("gray");
        }
        p.square(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
      }
    }
  }

  function drawPlayer() {
    p.push();

    p.fill(PLAYER.color);
    p.noStroke();
    p.translate(PLAYER.x, PLAYER.y);
    p.rectMode("center");
    p.rotate(PLAYER.angle);
    p.rect(0, 0, PLAYER.size, PLAYER.size);

    p.pop();
  }

  function checkCollision(px: number, py: number) {
    // will use the current player position to detect the collisions
    let half = PLAYER.size / 2;

    const corners = [
      { x: px - half, y: py - half }, // top left
      { x: px + half, y: py - half }, // top right
      { x: px + half, y: py + half }, // bottom right
      { x: px - half, y: py + half }, // bottom left
    ];

    // get the coresponding cell

    // check if any of the collision coordinate is on wall or not
    let collision = corners.some((item) => {
      // get corresponding cell
      let row = Math.floor(item.y / TILE_SIZE);
      let col = Math.floor(item.x / TILE_SIZE);

      return GRID[row][col] > 0;
    });

    return collision;
  }

  function playerControls() {
    // create temp var for px and py only update if no collision
    let px = PLAYER.x;
    let py = PLAYER.y;

    // the x and y component for movement
    let xc = p.sin(PLAYER.angle) * PLAYER.speed;
    let yc = p.cos(PLAYER.angle) * PLAYER.speed;

    if (p.keyIsDown(87)) {
      // w
      px += xc;
      py -= yc;
    }

    if (p.keyIsDown(83)) {
      // s
      px -= xc;
      py += yc;
    }

    // if collision false then update the actual positions
    if (!checkCollision(px, py)) {
      PLAYER.x = px;
      PLAYER.y = py;
    } else {
      // collision detection and reponse , handle sticky collision issue
      if (!checkCollision(px, py + yc) || !checkCollision(px, py - yc)) {
        // if no collision in x them move horizontally
        PLAYER.x = px;
      }

      if (!checkCollision(px - xc, py) || !checkCollision(px + xc, py)) {
        // if no collision in y then move vertically
        PLAYER.y = py;
      }
    }

    if (p.keyIsDown(68)) {
      // d
      PLAYER.angle += PLAYER.angleSpeed;
    }

    if (p.keyIsDown(65)) {
      // a
      PLAYER.angle -= PLAYER.angleSpeed;
    }
  }

  p.setup = () => {
    p.createCanvas(MAP_SIZE, MAP_SIZE);
    p.angleMode("degrees");
  };

  p.draw = () => {
    p.background(0);

    drawGrid();
    drawPlayer();
    playerControls();
  };
}
