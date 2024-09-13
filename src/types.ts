export type cellValueRange = 1 | 2 | 3;
export type rayHitPoint = {
  distance: number;
  face: "left" | "right" | "top" | "bottom" | undefined;
  hitaxis: "horizontal" | "vertical";
  cellValue: cellValueRange | undefined;
  angle: number;
  cell: { x: number; y: number };
  color: string;
};
