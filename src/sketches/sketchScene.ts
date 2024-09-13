import p5 from "p5";
import { SCENE_SIZE } from "../constants";
export function sketchScene(p: p5) {
  p.setup = () => {
    p.createCanvas(SCENE_SIZE, SCENE_SIZE);
    p.angleMode("degrees");
  };

  p.draw = () => {
    p.background(0);
  };
}
