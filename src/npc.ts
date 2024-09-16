import p5 from "p5";
import { GRID, PLAYER, TILE_SIZE } from "./constants";
export class SmartNPC {
  health: number;
  x: number;
  y: number;
  ang: number;
  rxe: number;
  rye: number;
  public distance: number;

  constructor(health: number, x: number, y: number, ang: number) {
    this.health = health;
    this.x = x;
    this.y = y;
    this.ang = ang;
    this.rxe = Math.sin((ang * Math.PI) / 180) * 10;
    this.rye = Math.cos((ang * Math.PI) / 180) * 10;
    this.distance = 0;
  }

  castRay(p: p5) {
    // get the x and y component

    let dx = PLAYER.x - this.x;
    let dy = PLAYER.y - this.y;

    let ang = p.atan2(dx, -dy);
    let xc = p.sin(ang);
    let yc = p.cos(ang);

    let rex = this.distance * xc;
    let rey = this.distance * -yc;

    if (this.distance > 1000) {
      this.distance = 0;
    }

    let cellx = Math.floor(rex / TILE_SIZE);
    let celly = Math.floor(rey / TILE_SIZE);
    console.log(celly, cellx);
    if (GRID[celly][cellx] > 0) {
      this.distance += 0.1;
    }

    this.ang = ang;
    console.log("bot > ", ang);

    p.push();
    p.strokeWeight(5);
    p.stroke("red");
    p.translate(this.x, this.y);
    p.line(0, 0, rex, rey);
    p.pop();
  }
}
