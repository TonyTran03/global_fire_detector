import { useEffect, useState } from "react";

const useGetConditions = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [heatMapData, setHeatMapData] = useState(null);
  const [riskMapData, setRiskMapData] = useState(null);
  const [currentFires, setCurrentFires] = useState(null);


  const handleGetWeather = (coordinates) => {
    fetch("global_fire_detector.railway.internal/api/get-weather-from-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: coordinates,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWeatherData({
          temp: data.temperature,
          RH: data.humidity,
          rain: data.rainIntensity,
          windSpeed: data.windSpeed,
          windDirection: data.windDirection,
        });
        fetch("global_fire_detector.railway.internal/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: {
              temp: data.temperature,
              RH: data.humidity,
              rain: data.rainIntensity,
              wind: data.windSpeed,
              month: new Date().getMonth() + 1,
            },
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setPrediction(data.prediction[0]);
          });
      });
  };

  const handleGetRiskmapData = (latitude, longitude) => {
    fetch("http://localhost:5000/api/get-riskmap-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        month: new Date().getMonth() + 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRiskMapData(data);
      });
  };

  const handleGetCurrentFires = (latitude, longitude) => {
    const radius = 1000; // specify the radius in kilometers

    fetch("global_fire_detector.railway.internal/api/get-fire-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: new Date().toISOString().split("T")[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const csvData = data.split("\n").map((row) => row.split(","));
        const filteredData = csvData.filter((row) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            parseFloat(row[0]),
            parseFloat(row[1])
          );
          return distance <= radius;
        });

        console.log(filteredData);
        setCurrentFires(filteredData);
      });
  };

  const handleGetHeatmapData = (latitude, longitude) => {
    fetch("http://localhost:5000/api/get-heatmap-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setHeatMapData(data);
        const csvData = data.split("\n").map((row) => row.split(","));
        const filteredData = csvData.filter((row) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            parseFloat(row[0]),
            parseFloat(row[1])
          );
          return distance <= radius;
        });

        console.log(filteredData);
        setCurrentFires(filteredData);
      });
  };

  return {
    weatherData,
    prediction,
    handleGetWeather,
    handleGetHeatmapData,
    heatMapData,
    handleGetRiskmapData,
    riskMapData,
    handleGetCurrentFires,
    currentFires,
    handleGetRiskmapData,
    riskMapData,
  };
};

export default useGetConditions;
