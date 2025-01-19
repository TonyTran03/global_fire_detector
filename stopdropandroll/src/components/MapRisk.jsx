"use client";
import React, { useState, useEffect } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetConditions from "@/hooks/useGetConditions";

const MapRisk = () => {
  const [viewState, setViewState] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 8,
  });

  const [geoJsonData, setGeoJsonData] = useState(null);

  const { handleGetWeather, prediction, handleGetRiskmapData, riskMapData } =
    useGetConditions();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 8, // Zoom in closer when showing user location
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []); // Empty dependency array means this runs once when component mounts

  const createHeatMap = (evt) => {
    const map = evt.target;

    map.addSource("trees", {
      type: "geojson",
      data: geoJsonData,
    });

    map.addLayer(
      {
        id: "trees-heat" /* Reference id. */,
        type: "heatmap" /* Type of layer being created. */,
        source:
          "trees" /* Source of the layer's data, as referred to above in addSource() */,
        maxzoom: 15 /* Maximum zoom level for this layer. If exceeded, this layer will not be displayed. */,
        paint: {
          /* Increase weight as diameter breast height increases. */
          "heatmap-weight": {
            property: "dbh",
            type: "exponential",
            stops: [
              [1, 0],
              [62, 1],
            ],
          },
          /* Increase intensity as zoom level increases. */
          "heatmap-intensity": {
            stops: [
              [11, 1],
              [15, 3],
            ],
          },
          /* Use sequential color palette to use exponentially as the weight increases. */
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(255,255,178,0)", // Light yellow, very low intensity
            0.2,
            "rgb(254,204,92)", // Yellow
            0.4,
            "rgb(253,141,60)", // Orange
            0.6,
            "rgb(240,59,32)", // Red
            0.8,
            "rgb(189,0,38)", // Dark red, very high intensity
          ],
          /* Increase radius as zoom increases. */
          "heatmap-radius": {
            stops: [
              [11, 15],
              [15, 20],
            ],
          },
          /* Decrease opacity to transition into the circle layer. */
          "heatmap-opacity": {
            default: 1,
            stops: [
              [14, 1],
              [15, 0],
            ],
          },
        },
      },
      "waterway-label"
    ); /* The layer just described will go above the waterway-label. */
  };

  const getLocation = async () => {
    handleGetWeather(viewState.latitude + ", " + viewState.longitude);
    return [viewState.latitude, viewState.longitude];
  };

  const getRiskMap = async () => {
    handleGetRiskmapData(viewState.latitude, viewState.longitude);
  };

  useEffect(() => {
    console.log("geojsonData");
    console.log(riskMapData);
    if (!riskMapData) return;
    const geoAverageJson = {
      type: "FeatureCollection",
      features: [],
    };

    Object.entries(riskMapData).forEach(([coordinates, dbh]) => {
      const [latitude, longitude] = coordinates
        .replace(/[()]/g, "")
        .split(",")
        .map(parseFloat);

      geoAverageJson.features.push({
        type: "Feature",
        properties: {
          dbh: dbh * 100,
        },
        geometry: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
      });
    });

    console.log(JSON.stringify(geoAverageJson));
    setGeoJsonData(geoAverageJson);
  }, [riskMapData]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return <div>Error: Mapbox access token not found</div>;
  }

  return (
    <div //map
      style={{
        width: "70vw",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div //map boarder
        style={{
          width: "100%",
          height: "60%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          position: "relative",
        }}
      >
        {geoJsonData && (
          <Map
            {...viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            onMove={(evt) => {
              setViewState(evt.viewState);
            }}
            onLoad={createHeatMap}
          >
            <NavigationControl />
          </Map>
        )}
      </div>
      <button
        onClick={() => getRiskMap()}
        className="p-4 text-white bg-green-900 rounded-sm m-4"
      >
        Get Riskmap Data
      </button>
      {prediction && (
        <>
          <h1 className="text-black">Prediction</h1>
          <pre className="text-black">
            There is {prediction[1] * 100}% a fire
          </pre>

          <h1 className="text-black">Weather Data</h1>
          <pre className="text-black">
            {JSON.stringify(weatherData, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default MapRisk;
