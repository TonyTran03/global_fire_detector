import { useEffect, useState } from "react";

const useGetConditions = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [currentFires, setCurrentFires] = useState(null);
  const [riskMapData, setRiskMapData] = useState(null);

  const handleGetWeather = (coordinates) => {
    fetch("magnificent-rejoicing-production.up.railway.app/api/get-weather-from-location", {
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
        fetch("magnificent-rejoicing-production.up.railway.app/api/predict", {
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

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleGetCurrentFires = (latitude, longitude) => {
    const radius = 1000; // specify the radius in kilometers

    fetch("magnificent-rejoicing-production.up.railway.app/api/get-fire-data", {
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

  return {
    weatherData,
    prediction,
    handleGetWeather,
    handleGetCurrentFires,
    currentFires,
    handleGetRiskmapData,
    riskMapData,
  };
};

export default useGetConditions;
