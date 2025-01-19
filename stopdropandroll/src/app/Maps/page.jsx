"use client";

import React from "react";
import MapComponent from "@/components/Map";
import MapCurrentFires from "@/components/MapCurrentFires";
import FireSimulation from "../FireSimulation";

export default function Maps() {
  return (
    <div>
      {/* <MapComponent /> */}
      <MapCurrentFires />
    </div>
  );
}
