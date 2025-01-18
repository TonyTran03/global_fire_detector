import React from "react";
import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  const [viewState, setViewState] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 8,
  });

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return <div>Error: Mapbox access token not found</div>;
  }

  return (
    <div style={{ width: "80vw", height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Map
        {...viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        <NavigationControl />
        <Marker latitude={45.4211} longitude={-75.6903}></Marker>
      </Map>
    </div>
  );
};

export default MapComponent;
