import { useRef, useEffect } from "react";
import p5 from "p5";

// Import sketches
import { sketchMap } from "./sketches/sketchMap";
import { sketchScene } from "./sketches/sketchScene";

export let texture = true;

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
    <div className="h-[100vh] bg-gray-200 flex justify-center items-center gap-5">
      <div ref={sceneRef} />
      <div className="h-[80%]">
        <div ref={mapRef} />
        <div className="bg-500 flex-auto h-2/4 p-5">
          <div className="flex gap-2 items-center">
            {new Array("W", "S", "A", "D").map((item) => {
              return (
                <kbd
                  key={item}
                  className="px-3 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-400 rounded-lg shadow-md shadow-outer border-b-[4px]"
                >
                  {item}
                </kbd>
              );
            })}
            <p className="text-xl text-gray-600 ">- for movement.</p>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <kbd className=" px-3 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-400 rounded-lg shadow-md shadow-outer border-b-[4px]">
              Space Bar
            </kbd>

            <p className="text-xl text-gray-600 ">- for shooting.</p>
          </div>
          <div className="flex items-center text-gray-600 text-xl gap-2 mt-4">
            <input
              defaultChecked={texture}
              type="checkbox"
              onChange={(e) => {
                texture = e.target.checked;
                e.target.blur();
              }}
            />
            <p>Texture</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
