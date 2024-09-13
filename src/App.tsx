import { useRef, useEffect } from "react";
import p5 from "p5";

// import sketches
import { sketchMap } from "./sketches/sketchMap";

function App() {
  let mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mapInstance = new p5(sketchMap, mapRef.current as HTMLDivElement);

    // cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <>
      <div className="h-[100vh] bg-gray-200 flex justify-center items-center">
        <div ref={mapRef}></div>
      </div>
    </>
  );
}

export default App;
