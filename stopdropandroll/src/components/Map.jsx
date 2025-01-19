"use client";
import React, { useState, useEffect } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetConditions from "@/hooks/useGetConditions";import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import ChatPopup from './ChatPopup';


const MapComponent = () => {
  const [viewState, setViewState] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    zoom: 8,
  });


  
  const { handleGetWeather, prediction, weatherData } = useGetConditions();
  const [searchInput, setSearchInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        setViewState(prev => ({
          ...prev,
          latitude,
          longitude,
          zoom: 10
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
      data: "/data/trees.geojson",
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

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return <div>Error: Mapbox access token not found</div>;
  }

  return (
    <div //map
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div //map boarder
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          position: "relative",
        }}
      >
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
      </div>

        <button onClick={getLocation}>Get Location</button>
      {prediction && (
        <>
          <h1>Prediction</h1>
          <pre>There is {prediction[1] * 100}% a fire</pre>

          <h1>Weather Data</h1>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </>
      )}
      {/*// The bar at the bottom */}
      <div className="h-[30%] w-[100%] bg-black text-white absolute bottom-0 z-10 ">
        <p className="text-lg mb-4 font-medium">Search for a specific location:</p>
        <input 
          type="text"
          value={searchInput} 
          onChange={(evt) => setSearchInput(evt.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 text-white transition-all duration-200"
          placeholder="Enter an Address or "
        />
        <button 
          onClick={handleSearch}
          className="mt-3 w-full  px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          Search
        </button>
        <p className="mt-3">Based on this location, your should evacuate to...</p>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="absolute bottom-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faComment} />
        </button>
        <ChatPopup 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
        />
      </div>

    </div>
  );
};

export default MapComponent;
