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
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { dbh: 92.78300404548645 },
            geometry: {
              type: "Point",
              coordinates: [-119.00758950606331, 34.82928783731189],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.12165069580078 },
            geometry: {
              type: "Point",
              coordinates: [-119.00758950606331, 34.839287837311886],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.74959564208984 },
            geometry: {
              type: "Point",
              coordinates: [-119.01067967600706, 34.81977727214894],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.85125923156738 },
            geometry: {
              type: "Point",
              coordinates: [-119.01067967600706, 34.848798402474834],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.88477301597595 },
            geometry: {
              type: "Point",
              coordinates: [-119.01490325757801, 34.82397408579723],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 66.1931037902832 },
            geometry: {
              type: "Point",
              coordinates: [-119.01490325757801, 34.831974085797235],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.89952516555786 },
            geometry: {
              type: "Point",
              coordinates: [-119.01655752852999, 34.81168710220519],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.70020318031311 },
            geometry: {
              type: "Point",
              coordinates: [-119.01655752852999, 34.85688857241858],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.75815486907959 },
            geometry: {
              type: "Point",
              coordinates: [-119.01737539353302, 34.81636563366687],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.65690636634827 },
            geometry: {
              type: "Point",
              coordinates: [-119.01737539353302, 34.8395825379276],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.90444254875183 },
            geometry: {
              type: "Point",
              coordinates: [-119.02207767555136, 34.80989349771187],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.65026640892029 },
            geometry: {
              type: "Point",
              coordinates: [-119.02207767555136, 34.8460546738826],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.64636039733887 },
            geometry: {
              type: "Point",
              coordinates: [-119.02221700909269, 34.818660334282555],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.9167091846466 },
            geometry: {
              type: "Point",
              coordinates: [-119.02221700909269, 34.824660334282555],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.8994357585907 },
            geometry: {
              type: "Point",
              coordinates: [-119.02407111105893, 34.812953995184785],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.88848042488098 },
            geometry: {
              type: "Point",
              coordinates: [-119.02407111105893, 34.830366673380325],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.1327531337738 },
            geometry: {
              type: "Point",
              coordinates: [-119.02464769847374, 34.80580924968227],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.77018094062805 },
            geometry: {
              type: "Point",
              coordinates: [-119.02464769847374, 34.862766424941505],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.91145205497742 },
            geometry: {
              type: "Point",
              coordinates: [-119.02759782257269, 34.80809989321853],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.4513418674469 },
            geometry: {
              type: "Point",
              coordinates: [-119.02759782257269, 34.83522077534658],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.61793279647827 },
            geometry: {
              type: "Point",
              coordinates: [-119.02854981150635, 34.805191215693526],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.15448093414307 },
            geometry: {
              type: "Point",
              coordinates: [-119.02854981150635, 34.85075695590094],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.86654591560364 },
            geometry: {
              type: "Point",
              coordinates: [-119.02953076060734, 34.81334658276787],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.85664558410645 },
            geometry: {
              type: "Point",
              coordinates: [-119.02953076060734, 34.81734658276787],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.8994357585907 },
            geometry: {
              type: "Point",
              coordinates: [-119.03076682858485, 34.80954235670269],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.87752509117126 },
            geometry: {
              type: "Point",
              coordinates: [-119.03076682858485, 34.821150808833046],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 67.39904880523682 },
            geometry: {
              type: "Point",
              coordinates: [-119.03245192453893, 34.804573181704775],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.33172726631165 },
            geometry: {
              type: "Point",
              coordinates: [-119.03245192453893, 34.838747486860335],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.55041456222534 },
            geometry: {
              type: "Point",
              coordinates: [-119.03311796959402, 34.806306288725196],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.87532567977905 },
            geometry: {
              type: "Point",
              coordinates: [-119.03311796959402, 34.82438687681054],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 67.36711859703064 },
            geometry: {
              type: "Point",
              coordinates: [-119.0341582636367, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.29561281204224 },
            geometry: {
              type: "Point",
              coordinates: [-119.0341582636367, 34.86585659488525],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 67.33551025390625 },
            geometry: {
              type: "Point",
              coordinates: [-119.03615826363671, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.8851842880249 },
            geometry: {
              type: "Point",
              coordinates: [-119.03615826363671, 34.853229091855944],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5293800830841 },
            geometry: {
              type: "Point",
              coordinates: [-119.03635403757151, 34.803955147716024],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.83351302146912 },
            geometry: {
              type: "Point",
              coordinates: [-119.03635403757151, 34.826738017819714],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.53422594070435 },
            geometry: {
              type: "Point",
              coordinates: [-119.03684451212204, 34.8080328312532],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51994466781616 },
            geometry: {
              type: "Point",
              coordinates: [-119.03684451212204, 34.8100328312532],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.53585314750671 },
            geometry: {
              type: "Point",
              coordinates: [-119.03746254611079, 34.80613071822061],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52037382125854 },
            geometry: {
              type: "Point",
              coordinates: [-119.03746254611079, 34.811934944285795],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 67.31891632080078 },
            geometry: {
              type: "Point",
              coordinates: [-119.0381582636367, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.27002453804016 },
            geometry: {
              type: "Point",
              coordinates: [-119.0381582636367, 34.84060158882659],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52288913726807 },
            geometry: {
              type: "Point",
              coordinates: [-119.03863811661537, 34.80451268423186],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52613759040833 },
            geometry: {
              type: "Point",
              coordinates: [-119.03863811661537, 34.813552978274544],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 67.29191541671753 },
            geometry: {
              type: "Point",
              coordinates: [-119.0401582636367, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51922941207886 },
            geometry: {
              type: "Point",
              coordinates: [-119.0401582636367, 34.827974085797216],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52123808860779 },
            geometry: {
              type: "Point",
              coordinates: [-119.04025615060412, 34.803337113727274],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5293800830841 },
            geometry: {
              type: "Point",
              coordinates: [-119.04025615060412, 34.81472854877913],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52009963989258 },
            geometry: {
              type: "Point",
              coordinates: [-119.04215826363671, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5334153175354 },
            geometry: {
              type: "Point",
              coordinates: [-119.04215826363671, 34.81534658276788],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51894927024841 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.80271907973852],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52856945991516 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.81534658276788],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52009963989258 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.827974085797216],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.78508806228638 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.84060158882659],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 65.13774991035461 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.853229091855944],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.42412829399109 },
            geometry: {
              type: "Point",
              coordinates: [-119.0441582636367, 34.86585659488525],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51750087738037 },
            geometry: {
              type: "Point",
              coordinates: [-119.04606037666929, 34.803337113727274],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52181029319763 },
            geometry: {
              type: "Point",
              coordinates: [-119.04606037666929, 34.81472854877913],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51678562164307 },
            geometry: {
              type: "Point",
              coordinates: [-119.04767841065804, 34.80451268423186],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5198016166687 },
            geometry: {
              type: "Point",
              coordinates: [-119.04767841065804, 34.813552978274544],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51593327522278 },
            geometry: {
              type: "Point",
              coordinates: [-119.04796248970189, 34.803955147716024],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5208089351654 },
            geometry: {
              type: "Point",
              coordinates: [-119.04796248970189, 34.826738017819714],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51405572891235 },
            geometry: {
              type: "Point",
              coordinates: [-119.04885398116262, 34.80613071822061],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5166425704956 },
            geometry: {
              type: "Point",
              coordinates: [-119.04885398116262, 34.811934944285795],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51435375213623 },
            geometry: {
              type: "Point",
              coordinates: [-119.04947201515137, 34.8080328312532],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5124762058258 },
            geometry: {
              type: "Point",
              coordinates: [-119.04947201515137, 34.8100328312532],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.5166425704956 },
            geometry: {
              type: "Point",
              coordinates: [-119.04986460273447, 34.804573181704775],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.8709328174591 },
            geometry: {
              type: "Point",
              coordinates: [-119.04986460273447, 34.838747486860335],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51319146156311 },
            geometry: {
              type: "Point",
              coordinates: [-119.05119855767938, 34.806306288725196],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.52238845825195 },
            geometry: {
              type: "Point",
              coordinates: [-119.05119855767938, 34.82438687681054],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51405572891235 },
            geometry: {
              type: "Point",
              coordinates: [-119.05176671576706, 34.805191215693526],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.67204594612122 },
            geometry: {
              type: "Point",
              coordinates: [-119.05176671576706, 34.85075695590094],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.50673031806946 },
            geometry: {
              type: "Point",
              coordinates: [-119.05354969868856, 34.80954235670269],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51736974716187 },
            geometry: {
              type: "Point",
              coordinates: [-119.05354969868856, 34.821150808833046],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51162385940552 },
            geometry: {
              type: "Point",
              coordinates: [-119.05366882879966, 34.80580924968227],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.53820776939392 },
            geometry: {
              type: "Point",
              coordinates: [-119.05366882879966, 34.862766424941505],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.50760650634766 },
            geometry: {
              type: "Point",
              coordinates: [-119.05471870470072, 34.80809989321853],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.86763668060303 },
            geometry: {
              type: "Point",
              coordinates: [-119.05471870470072, 34.83522077534658],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51362657546997 },
            geometry: {
              type: "Point",
              coordinates: [-119.05478576666606, 34.81334658276787],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51621341705322 },
            geometry: {
              type: "Point",
              coordinates: [-119.05478576666606, 34.81734658276787],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51277422904968 },
            geometry: {
              type: "Point",
              coordinates: [-119.05823885172205, 34.80989349771187],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.8786256313324 },
            geometry: {
              type: "Point",
              coordinates: [-119.05823885172205, 34.8460546738826],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.50783896446228 },
            geometry: {
              type: "Point",
              coordinates: [-119.05824541621448, 34.812953995184785],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.84563660621643 },
            geometry: {
              type: "Point",
              coordinates: [-119.05824541621448, 34.830366673380325],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51089668273926 },
            geometry: {
              type: "Point",
              coordinates: [-119.06009951818072, 34.818660334282555],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.51678562164307 },
            geometry: {
              type: "Point",
              coordinates: [-119.06009951818072, 34.824660334282555],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.63462615013123 },
            geometry: {
              type: "Point",
              coordinates: [-119.06175899874341, 34.81168710220519],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.7261610031128 },
            geometry: {
              type: "Point",
              coordinates: [-119.06175899874341, 34.85688857241858],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.50807738304138 },
            geometry: {
              type: "Point",
              coordinates: [-119.0629411337404, 34.81636563366687],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 92.85664558410645 },
            geometry: {
              type: "Point",
              coordinates: [-119.0629411337404, 34.8395825379276],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 86.50931715965271 },
            geometry: {
              type: "Point",
              coordinates: [-119.0654132696954, 34.82397408579723],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.78474235534668 },
            geometry: {
              type: "Point",
              coordinates: [-119.0654132696954, 34.831974085797235],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 90.64761400222778 },
            geometry: {
              type: "Point",
              coordinates: [-119.06763685126634, 34.81977727214894],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.88006210327148 },
            geometry: {
              type: "Point",
              coordinates: [-119.06763685126634, 34.848798402474834],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.79241347312927 },
            geometry: {
              type: "Point",
              coordinates: [-119.07072702121009, 34.82928783731189],
            },
          },
          {
            type: "Feature",
            properties: { dbh: 88.78448009490967 },
            geometry: {
              type: "Point",
              coordinates: [-119.07072702121009, 34.839287837311886],
            },
          },
        ],
      },
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
        height: "100vh",
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
          height: "90%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          position: "relative",
        }}
      >
        {true && (
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
      <button onClick={() => getRiskMap()}>Get Riskmap Data</button>
      <button onClick={getLocation}>Get Location</button>
      {prediction && (
        <>
          <h1>Prediction</h1>
          <pre>There is {prediction[1] * 100}% a fire</pre>

          <h1>Weather Data</h1>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default MapRisk;
