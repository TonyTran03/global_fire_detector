"use client";

import React, { useState } from "react";
import MapComponent from "../../components/Map";
import MapCurrentFires from "../../components/MapCurrentFires";
import MapRisk from "../../components/MapRisk";
import TemperatureMap from "../../components/TemperatureMap";

export default function Maps() {
  const [mapChoice, setMapChoice] = useState(0);
  return (
    <div>
      <MapComponent />
    </div>
  );
}
