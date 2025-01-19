"use client";

import React, { useState } from "react";
import MapComponent from "@/components/Map";
import MapCurrentFires from "@/components/MapCurrentFires";
import MapRisk from "@/components/MapRisk";
import TemperatureMap from "@/components/TemperatureMap";

export default function Maps() {
  const [mapChoice, setMapChoice] = useState(0);
  return (
    <div className="text-center bg-white pt-8">
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className="px-4 py-2 rounded-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={() => setMapChoice(0)}
        >
          Map
        </button>
        <button
          className="px-4 py-2 rounded-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={() => setMapChoice(1)}
        >
          Current Fires
        </button>

        <button
          className="px-4 py-2 rounded-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={() => setMapChoice(2)}
        >
          Risk Map
        </button>
        {/* <button
          className="px-4 py-2 rounded-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={() => setMapChoice(3)}
        >
          Temperature Map
        </button> */}
      </div>
      {mapChoice === 0 && <MapComponent />}
      {mapChoice === 1 && <MapCurrentFires />}
      {mapChoice === 2 && <MapRisk />}
      {/* {mapChoice === 3 && <TemperatureMap />} */}
    </div>
  );
}
