import p5 from "p5";

import type { npc as npcType } from "../types";
import {
  FOV,
  PLAYER,
  SCENE_SIZE,
  STRIP_WIDTH,
  TILE_SIZE,
  GRID,
} from "../constants";
import { rayHitPoints } from "./sketchMap";
import { texture } from "../App";

let corrected: number[] = [];
let zdepth: number[] = [];
export let npc = generateRandomEnemies(10);

let wallTextures: p5.Image[] = [];
let demonSprites: p5.Image[] = [];
let gunSprites: p5.Image[] = [];

function generateRandomEnemies(count: number): npcType[] {
  const enemies: npcType[] = [];
  const emptyCells: { x: number; y: number }[] = [];

  // Find all empty cells
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[y].length; x++) {
      if (GRID[y][x] === 0) {
        emptyCells.push({ x, y });
      }
    }
  }

  // Shuffle the empty cells array
  for (let i = emptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
  }

  // Generate enemies
  for (let i = 0; i < Math.min(count, emptyCells.length); i++) {
    const cell = emptyCells[i];
    const x = (cell.x + 0.5) * TILE_SIZE; // Center of the cell
    const y = (cell.y + 0.5) * TILE_SIZE; // Center of the cell

    enemies.push({
      x,
      y,
      ang: Math.random() * 360, // Random angle
      health: 10,
      start: x - TILE_SIZE * 2, // Example movement range
      end: x + TILE_SIZE * 2,
      movement: 1,
    });
  }

  return enemies;
}

function billboardSprites(
  p: p5,
  spriteImgs: p5.Image[],
  idx: number,
  frameRate: number
) {
  // sprite position relative to the player
  let dx = npc[idx].x - PLAYER.x;
  let dy = npc[idx].y - PLAYER.y;

  // distance of sprite from player sqrt(dx2 + dy2)
  let spriteDistance = Math.sqrt(dx * dx + dy * dy);

  // sprite's angle relative to the player's viewing direction
  let spriteAngle =
    Math.atan2(dx, -dy) - ((PLAYER.angle % 360) * Math.PI) / 180;

  npc[idx].ang = ((spriteAngle * 180) / Math.PI) % 360; // also update the relative angle for npc sprite

  // normalize the angle
  if (spriteAngle < -Math.PI) spriteAngle += 2 * Math.PI;
  if (spriteAngle > Math.PI) spriteAngle -= 2 * Math.PI;

  // check if sprite is comves in fov of player
  if (Math.abs(spriteAngle) < (FOV / 2 + 10) * (Math.PI / 180)) {
    const frameIndex = Math.floor(
      // get the current animation frame
      (p.frameCount / frameRate) % spriteImgs.length
    );
    const spriteImg = spriteImgs[frameIndex];

    // calculate the sprite's screen position
    // 1- sprite Relativ angle / fov/2(radians) => range b/w -1 to 0 [ -1 far left , 0 center and 1 means far right ]
    // 2- map the value in range -1 to 1 to 0 to 1 by multiplying by 0.5 and then adding 0.5
    // 3- once value is mapped to 0 to 1 range , scale that to canvas width
    let screenX =
      (0.5 * (spriteAngle / ((FOV / 2) * (Math.PI / 180))) + 0.5) * p.width;
    // Calculate the sprite's height based on its distance

    // sprite height will be inversly proportional to the sprite distance
    let spriteHeight = ((TILE_SIZE * 0.25) / spriteDistance) * p.height;

    let screenY = p.height / 2 - spriteHeight / 2; // center the sprite on the screen

    // keep the aspect ration according to the height
    // aspect : wdith/height
    // width = height * (w/h);
    let spriteWidth = spriteHeight * (spriteImg.width / spriteImg.height);

    // need to center the sprite at screenX coordinate
    // so calculate the xleft and xright by subtracting and adding half of sprite width to it
    let spriteLeft = screenX - spriteWidth / 2;
    let spriteRight = screenX + spriteWidth / 2;

    // initial visible porition of the sprite on left and right
    let visibleLeft = spriteLeft;
    let visibleRight = spriteRight;

    // using zdepth check how much sprite is being clipped by the walls stripes
    let stripWidth = p.width / zdepth.length;
    for (let i = 0; i < zdepth.length; i++) {
      let stripX = i * stripWidth;
      if (stripX >= spriteLeft && stripX <= spriteRight) {
        if (zdepth[i] <= spriteDistance) {
          // Wall is in front of sprite at this strip
          if (stripX < screenX) {
            visibleLeft = Math.max(visibleLeft, stripX + stripWidth);
          } else {
            visibleRight = Math.min(visibleRight, stripX);
            break; // No need to check further right
          }
        }
      }
    }

    // draw visible portion of hte sprite
    if (visibleRight > visibleLeft) {
      // Calculate texture coordinates
      let textureLeft =
        ((visibleLeft - spriteLeft) / spriteWidth) * spriteImg.width;
      let textureRight =
        ((visibleRight - spriteLeft) / spriteWidth) * spriteImg.width;
      p.image(
        spriteImg,
        visibleLeft,
        screenY,
        visibleRight - visibleLeft,
        spriteHeight,
        textureLeft,
        0,
        textureRight - textureLeft,
        spriteImg.height
      );
    }
  }
}

function drawWalls(p: p5) {
  corrected = []; // will store the corrected distance once fisheye effect is sorted out
  zdepth = []; // keep track of each strip of wall texture distance from player

  // go over all rays and draw strips that makes up the wall
  for (let i = 0; i < rayHitPoints.length; i++) {
    let wallTxt =
      wallTextures[
        rayHitPoints[i].cellValue as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
      ];
    zdepth.push(rayHitPoints[i].distance);
    // we want the distance as if player was standing directly infront of the ray hit point on the wall
    let correctedDistance =
      p.cos(rayHitPoints[i].angle) * rayHitPoints[i].distance;
    corrected.push(correctedDistance); // correct the fish eye effect

    // height is inversely proportional to the distance
    let height = ((TILE_SIZE * 0.5) / correctedDistance) * p.height;

    // center the wall stripes
    let wallCenter = p.height / 2 - height / 2;

    // map the distance 0-scenewidth onto another range => 255(brightest) to 50
    // the far away the wall strip the dimmer it gets
    let brightness = p.map(correctedDistance, 0, p.width, 255, 50);
    let wallColor = p.color(rayHitPoints[i].color);
    wallColor.setAlpha(brightness); // apply the transparency

    let textX = -1;
    // apply texture on to the walls
    if (rayHitPoints[i].hitaxis == "horizontal") {
      // 1- get the x component
      // 2- get x value relative to the scene px+xcomp
      // 3- get the x offset xvalue - tilex
      // 4- txtoffset = (xoffset/tileside) * txtwidth > scale according to txtwidth
      let xc =
        p.sin(rayHitPoints[i].angle + PLAYER.angle) * rayHitPoints[i].distance;
      let x = PLAYER.x + xc;
      let xo = x - rayHitPoints[i].cell.x * TILE_SIZE;
      textX = (xo / TILE_SIZE) * wallTxt.width;
    }

    if (rayHitPoints[i].hitaxis == "vertical") {
      let yc =
        p.cos(rayHitPoints[i].angle + PLAYER.angle) * rayHitPoints[i].distance;
      let y = PLAYER.y - yc;
      let yo = y - rayHitPoints[i].cell.y * TILE_SIZE;
      textX = (yo / TILE_SIZE) * wallTxt.width;
    }

    if (texture) {
      // apply texture image
      p.image(
        wallTxt,
        // x and y for the strip
        i * STRIP_WIDTH,
        wallCenter,
        // width , height of texture to be applied
        STRIP_WIDTH + 1,
        height,
        // x , y coordinates in texture image
        textX,
        0,
        // width and height of txt to be samples
        0.01,
        wallTxt.height
      );
    } else {
      // fill the color and make the rectangle
      p.stroke(wallColor);
      p.fill(wallColor);
      p.rect(i * STRIP_WIDTH, wallCenter, STRIP_WIDTH, height);
    }
  }
}

export function sketchScene(p: p5) {
  // Gun animation variables
  let gunCurrentFrame = 0;
  let gunTotalFrames = 4;
  let gunIsAnimating = false;
  let gunAnimationStartTime = 0;
  const gunFrameDuration = 100; // ms

  p.setup = () => {
    p.createCanvas(SCENE_SIZE, SCENE_SIZE);
    p.angleMode("degrees");
  };

  p.preload = () => {
    for (let i = 1; i <= 10; i++) {
      wallTextures[i] = p.loadImage(`/wallTexture/w_${i}.jpg`);
    }
    // load flying demon sprites
    for (let i = 0; i < 4; i++) {
      demonSprites[i] = p.loadImage(`/enemy/flyingDemon/IDLE_${i}.png`); // Adjust index for 0-based array
    }
    // load gun sprites
    for (let i = 1; i <= gunTotalFrames; i++) {
      gunSprites[i - 1] = p.loadImage(`/gun/g_${i}.png`); // Adjust index for 0-based array
    }
  };

  p.keyPressed = () => {
    if (p.keyCode === 32 && !gunIsAnimating) {
      console.log("Shoot");
      // 32 is the keyCode for spacebar
      // Create a new Audio object and play it
      const shootSound = new Audio("/gun/shoot.wav");
      shootSound.play();
      gunIsAnimating = true;
      gunAnimationStartTime = p.millis();

      console.log(npc);

      for (let i = 0; i < npc.length; i++) {
        if (npc[i].health <= 0) continue;
        if (npc[i].ang < 5 && npc[i].ang > -5) {
          npc[i].health -= 10;
        }
      }

      console.log(npc);
    }
  };

  function drawSkyAndFloor() {
    const numSteps = 360; // Number of steps for each half
    const darkGray = p.color(82, 82, 82); // Approximately gray-700 in tailwind
    const black = p.color(0, 0, 0); // Black
    const lightGray = p.color(220, 220, 220); // Light gray for the floor

    p.noStroke(); // Remove stroke

    // Draw top half (dark gray to black)
    for (let i = 0; i <= numSteps; i++) {
      let inter = i / numSteps;
      let shade = p.lerpColor(darkGray, black, inter);
      p.fill(shade);
      p.rect(
        0,
        (i * p.height) / (2 * numSteps) - 1,
        p.width,
        p.height / numSteps + 2
      );
    }

    // Draw bottom half (light gray to dark gray)
    for (let i = 0; i <= numSteps; i++) {
      let inter = i / numSteps;
      let shade = p.lerpColor(lightGray, darkGray, inter);
      p.fill(shade);
      p.rect(
        0,
        p.height - (i * p.height) / (2 * numSteps) - 1,
        p.width,
        p.height / numSteps + 2
      );
    }
  }

  // function drawskyandfloor() {
  //   p.push();
  //   p.fill(0);
  //   p.rect(0, 0, p.width, p.height / 2);
  //   p.fill(255);
  //   p.rect(0, p.height / 2, p.width, p.height / 2);
  //   p.pop();
  // }

  // p.windowResized = () => {
  //   let width = window.innerWidth * 0.9;
  //   let height = width;
  //   if (window.innerHeight < height) {
  //     width = height = window.innerHeight * 0.9;
  //   }

  //   p.resizeCanvas(width, height);
  // };

  p.draw = () => {
    p.background(255);

    // drawskyandfloor();
    drawSkyAndFloor();
    // sky
    drawWalls(p);

    // draw sprites afer wall
    for (let i = 0; i < npc.length; i++) {
      if (npc[i].health > 0) {
        // drawSprite(p, sprite, i);
        billboardSprites(p, demonSprites, i, 3);
      }
    }

    // draw target
    p.push();
    p.textAlign("center");
    p.stroke(0, 255, 0);
    p.fill(0, 255, 0);
    p.textSize(50);
    p.text("+", p.width / 2, p.height / 2 + 20);
    p.pop();

    // draw gun
    let height = p.height * 0.5;
    let width = (height * gunSprites[0].width) / gunSprites[0].height;
    p.imageMode("corner");
    p.image(gunSprites[gunCurrentFrame], 340, 420, width, height);
    // handle gun animation
    if (gunIsAnimating) {
      const elapsedTime = p.millis() - gunAnimationStartTime;
      gunCurrentFrame =
        Math.floor(elapsedTime / gunFrameDuration) % gunTotalFrames;

      if (elapsedTime >= gunTotalFrames * gunFrameDuration) {
        gunIsAnimating = false;
        gunCurrentFrame = 0;
      }
    }
  };
}
