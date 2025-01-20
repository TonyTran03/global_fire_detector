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

  const { handleGetWeather, prediction, weatherData } = useGetConditions();
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
  }, []);

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
