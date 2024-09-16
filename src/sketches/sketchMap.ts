import p5 from "p5";

// import class
import { SmartNPC } from "../npc";

// import types
import { rayHitPoint, cellValueRange } from "../types";

// import constants
import {
  GRID,
  MAP_SIZE,
  TILE_SIZE,
  PLAYER,
  CELL_COLOR,
  RAYS,
  START_ANGLE,
  ANGLE_STEP,
} from "../constants";

import { npc } from "./sketchScene";

export let rayHitPoints: rayHitPoint[] = [];
export let bot = new SmartNPC(100, 75, 57, 0);

let wallTextures: p5.Image[] = [];
export function sketchMap(p: p5) {
  // helper functions for drawing grid , casting rays and all

  function drawGrid() {
    for (let row = 0; row < GRID.length; row++) {
      for (let col = 0; col < GRID[row].length; col++) {
        p.stroke(255);
        p.noFill();
        if (GRID[row][col] > 0) {
          p.image(
            wallTextures[GRID[row][col]],
            col * TILE_SIZE,
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        }
        p.square(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // function drawBot() {
  //   p.push();
  //   p.fill("green");
  //   p.strokeWeight(5);
  //   p.fill("red");
  //   p.translate(bot.x, bot.y);

  //   p.rectMode("center");
  //   p.rotate(bot.ang);
  //   p.square(0, 0, TILE_SIZE * 0.4);
  //   p.pop();
  // }

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

  function drawNpcs() {
    p.push();
    npc.forEach((element) => {
      if (element.health > 0) {
        p.fill("red");
        p.circle(element.x, element.y, TILE_SIZE * 0.2);
      }
    });
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

  function exceed(x: number, y: number) {
    // if not in this range then return true
    if (!(x < GRID.length && y < GRID.length && x >= 0 && y >= 0)) {
      return true;
    }
    return false;
  }

  function castRay(angle: number) {
    let ang = PLAYER.angle + angle;
    let px = PLAYER.x;
    let py = PLAYER.y;

    // directions
    const UP = p.cos(ang) >= 0 ? true : false;
    const LEFT = p.sin(ang) < 0 ? true : false;

    // tackling horizontal now
    let nearY = UP
      ? Math.floor(py / TILE_SIZE) * TILE_SIZE
      : (Math.floor(py / TILE_SIZE) + 1) * TILE_SIZE;
    let nearX = LEFT
      ? Math.floor(px / TILE_SIZE) * TILE_SIZE
      : (Math.floor(px / TILE_SIZE) + 1) * TILE_SIZE;

    // nearest y ( always + )
    // nearest x ( + or - )
    let hny = UP ? py - nearY : nearY - py;
    // tan(0) = x/y , p/b
    let hnx = p.tan(ang) * hny;

    let vnx = LEFT ? px - nearX : nearX - px;
    let vny = vnx / p.tan(ang);

    // temp vars that will hold the end points of the ray
    let hey = UP ? py - hny : py + hny;
    let hex = UP ? px + hnx : px - hnx;

    let vex = LEFT ? px - vnx : px + vnx;
    let vey = LEFT ? py + vny : py - vny;

    let hstepy = TILE_SIZE;
    let hstepx = p.tan(ang) * hstepy;

    let vstepx = TILE_SIZE;
    let vstepy = vstepx / p.tan(ang);

    let horizontalRayHitData: rayHitPoint = {
      distance: 0,
      face: undefined,
      hitaxis: "horizontal",
      cellValue: undefined,
      angle: angle,
      cell: { x: -1, y: -1 },
      color: "white",
    };

    let verticalRayHitData: rayHitPoint = {
      distance: 0,
      face: undefined,
      hitaxis: "vertical",
      cellValue: undefined,
      angle: angle,
      cell: { x: -1, y: -1 },
      color: "white",
    };
    // horizonal
    while (true) {
      let celly = UP
        ? Math.floor(hey / TILE_SIZE) - 1
        : Math.floor(hey / TILE_SIZE);
      let cellx = Math.floor(hex / TILE_SIZE);

      if (exceed(cellx, celly)) break;
      if (GRID[celly][cellx] > 0) {
        horizontalRayHitData = {
          ...horizontalRayHitData,
          face: UP ? "bottom" : "top",
          cellValue: GRID[celly][cellx] as cellValueRange,
          cell: { x: cellx, y: celly },
          color: CELL_COLOR[GRID[celly][cellx] as cellValueRange],
        };

        break;
      }

      hey += UP ? -hstepy : +hstepy;
      hex += UP ? hstepx : -hstepx;
    }

    while (true) {
      let cellx = LEFT
        ? Math.floor(vex / TILE_SIZE) - 1
        : Math.floor(vex / TILE_SIZE);
      let celly = Math.floor(vey / TILE_SIZE);
      if (exceed(cellx, celly)) break;
      if (GRID[celly][cellx] > 0) {
        verticalRayHitData = {
          ...verticalRayHitData,
          face: LEFT ? "right" : "left",
          cellValue: GRID[celly][cellx] as cellValueRange,
          cell: { x: cellx, y: celly },
          color: CELL_COLOR[GRID[celly][cellx] as cellValueRange],
        };

        break;
      }

      vex += LEFT ? -vstepx : vstepx;
      vey += LEFT ? vstepy : -vstepy;
    }

    let horizontalDistance = Math.sqrt(
      Math.pow(hex - px, 2) + Math.pow(hey - py, 2)
    );
    let verticalDistance = Math.sqrt(
      Math.pow(vex - px, 2) + Math.pow(vey - py, 2)
    );

    horizontalRayHitData = {
      ...horizontalRayHitData,
      distance: horizontalDistance,
    };
    verticalRayHitData = {
      ...verticalRayHitData,
      distance: verticalDistance,
    };

    // let minDistance = horizontal;

    p.push();

    // p.line(playerPos.current.x, playerPos.current.y, hex, hey);
    p.strokeWeight(1);
    if (horizontalDistance < verticalDistance) {
      rayHitPoints.push(horizontalRayHitData);
      // p.stroke(horizontalRayHitData.color);
      p.stroke("cyan");
      p.line(PLAYER.x, PLAYER.y, hex, hey);
    } else {
      rayHitPoints.push(verticalRayHitData);
      // p.stroke(verticalRayHitData.color);
      p.stroke("cyan");
      p.line(PLAYER.x, PLAYER.y, vex, vey);
    }

    p.pop();
  }

  p.setup = () => {
    p.createCanvas(MAP_SIZE, MAP_SIZE);

    p.angleMode("degrees");
  };

  p.preload = () => {
    for (let i = 1; i <= 10; i++) {
      wallTextures[i] = p.loadImage(`/wallTexture/w_${i}.jpg`);
    }
  };

  p.draw = () => {
    p.background(0);

    drawGrid();
    drawPlayer();
    drawNpcs();
    // bot.castRay(p);
    playerControls();

    rayHitPoints = [];
    for (let i = 0; i < RAYS; i++) {
      castRay(START_ANGLE + ANGLE_STEP * i);
    }

    // drawBot();
  };
}
