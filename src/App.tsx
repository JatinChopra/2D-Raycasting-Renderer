import { useRef, useEffect } from "react";
import p5 from "p5";

// Import sketches
import { sketchMap } from "./sketches/sketchMap";
import { sketchScene } from "./sketches/sketchScene";

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure cleanup is performed
    const mapCanvas = mapRef.current!;
    const sceneCanvas = sceneRef.current!;

    const mapInstance = new p5(sketchMap, mapCanvas);
    const sceneInstance = new p5(sketchScene, sceneCanvas);

    // Cleanup function to remove p5 instances
    return () => {
      mapInstance.remove();
      sceneInstance.remove();
    };
  }, []);

  return (
    <div className="h-[100vh] bg-gray-200 flex justify-center items-center">
      <div ref={sceneRef} />
      <div ref={mapRef} />
    </div>
  );
}

export default App;
