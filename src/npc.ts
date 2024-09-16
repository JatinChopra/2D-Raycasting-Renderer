import p5 from "p5";
import { PLAYER, TILE_SIZE } from "./constants";
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

    console.log(TILE_SIZE);

    let playercellx = Math.floor(PLAYER.x / TILE_SIZE);
    let playercelly = Math.floor(PLAYER.y / TILE_SIZE);
    console.log(playercellx, playercelly);

    this.x += xc * 0.4;
    this.y += -yc * 0.4;

    this.ang = ang;
    console.log("bot > ", ang);
  }
}
