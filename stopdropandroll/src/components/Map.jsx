"use client";
import React, { useState, useEffect, Suspense } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetConditions from "../hooks/useGetConditions";
import ChatPopup from "./ChatPopup";
import { Canvas } from "@react-three/fiber";
import { TruckModel } from "./TruckModel";

const MapComponent = () => {
  const [viewState, setViewState] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 8,
  });

  const [geoJsonData, setGeoJsonData] = useState(null);

  const {
    handleGetWeather,
    prediction,
    weatherData,
    handleGetHeatmapData,
    heatMapData,
  } = useGetConditions();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
          zoom: 10,
        }));
        setSearchInput("");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 8,
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

  const getHeatmapData = async () => {
    handleGetHeatmapData(viewState.latitude, viewState.longitude);
  };

  useEffect(() => {
    console.log("geojsonData");
    console.log(heatMapData);
    if (!heatMapData) return;
    const geoAverageJson = {
      type: "FeatureCollection",
      features: [],
    };

    // Step 1: Find the maximum temperature in the data
    const maxTemperature = Math.max(
      ...Object.values(heatMapData).map((data) => data.temperature)
    );

    Object.entries(heatMapData).forEach(([coordinates, data]) => {
      const [latitude, longitude] = coordinates
        .replace(/[()]/g, "")
        .split(",")
        .map(parseFloat);

      const normalizedTemperature =
        (data.temperature / maxTemperature) * 100 * Math.random();

      geoAverageJson.features.push({
        type: "Feature",
        properties: {
          dbh: normalizedTemperature,
        },
        geometry: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
      });

      // Generate random blobs
      const numBlobs = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
      const blobRadius = 0.01; // Adjust the radius of the blobs as needed

      for (let i = 0; i < numBlobs; i++) {
        const randomLatitude = latitude + (Math.random() - 0.5) * blobRadius;
        const randomLongitude = longitude + (Math.random() - 0.5) * blobRadius;

        const randomNormalizedTemperature =
          (data.temperature / maxTemperature) * 100 * Math.random();

        geoAverageJson.features.push({
          type: "Feature",
          properties: {
            dbh: randomNormalizedTemperature,
          },
          geometry: {
            type: "Point",
            coordinates: [randomLatitude, randomLongitude],
          },
        });
      }
    });

    console.log(JSON.stringify(geoAverageJson));
    setGeoJsonData(geoAverageJson);
  }, [heatMapData]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return <div>Error: Mapbox access token not found</div>;
  }

  return (
    <div className="flex w-screen h-screen relative">
      {/* Map Section */}
      <div className="w-full md:w-2/3 h-full relative">
        <Map
          {...viewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onMove={(evt) => {
            setViewState(evt.viewState);
          }}
        >
          <div //map boarder
            style={{
              width: "100%",
              height: "90%",
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
          <button onClick={() => getHeatmapData()}>Get Heatmap Data</button>
          <button onClick={getLocation}>Get Location</button>
          {prediction && (
            <>
              <h1>Prediction</h1>
              <pre>There is {prediction[1] * 100}% a fire</pre>

              <h1>Weather Data</h1>
              <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            </>
          )}
          <div className="h-[90%] w-[30%] bg-black text-white p-4">
            <p className="text-lg mb-4 font-medium">
              Search for a specific location:
            </p>
            <input
              type="text"
              value={searchInput}
              onChange={(evt) => setSearchInput(evt.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 text-white transition-all duration-200"
              placeholder="Enter location..."
            />
            <button
              onClick={handleSearch}
              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Search
            </button>
            <p className="mt-3">
              Based on this location, your should evacuate to...
            </p>
          </div>
          <NavigationControl />
        </Map>

        {/* Search Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-gray-800 text-white p-2 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-lg mb-2 md:mb-0 font-medium md:mr-4">
              Search for a location:
            </p>
            <div className="flex w-full md:w-auto">
              <input
                type="text"
                value={searchInput}
                onChange={(evt) => setSearchInput(evt.target.value)}
                className="flex-grow md:flex-none w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-400 text-white transition-all duration-200"
                placeholder="Enter an address or location"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                        text-white font-medium rounded-r-lg transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="hidden flex-1 md:flex md:w-1/3 h-full flex-col bg-gray-100 shadow-lg relative">
        {/* Truck Model Section */}
        <div className="relative h-1/2 w-full flex-col justify-center items-center">
          <Suspense fallback={<div>Loading Truck...</div>}>
            <Canvas
              style={{ width: "100%", height: "100%" }}
              camera={{ position: [0, 2, 5], fov: 75 }}
            >
              <ambientLight intensity={1} />
              <directionalLight position={[2, 5, 3]} intensity={2} />
              <TruckModel />
            </Canvas>
          </Suspense>

          {/* Chat Section */}
          <div className="flex-1 flex h-1/2 w-full border-t border-gray-300 p-2">
            <ChatPopup />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
