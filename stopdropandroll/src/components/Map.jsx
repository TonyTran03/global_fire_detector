'use client';
import React, { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BorderBeam } from "@/components/ui/border-beam.jsx";

const MapComponent = () => {
  const [viewState, setViewState] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 8,
  });

  const getLocation = () => {
    return [viewState.latitude, viewState.longitude];
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return <div>Error: Mapbox access token not found</div>;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          position: "relative", // Ensure relative positioning for the container
        }}
      >
        {/* BorderBeam placed correctly */}
        <BorderBeam
          size={500}
          duration={15}
          anchor={90}
          borderWidth={2}
          colorFrom="#ffaa40"
          colorTo="#9c40ff"
        />
        <Map
          {...viewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onMove={(evt) => {
            setViewState(evt.viewState);
          }}
        >
          <NavigationControl />
        </Map>
      </div>
      <button onClick={getLocation}>Get Location</button>
    </div>
  );
};

export default MapComponent;