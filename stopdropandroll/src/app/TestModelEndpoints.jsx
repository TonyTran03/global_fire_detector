import { useEffect, useState } from "react";

export default function TestModelEndpoints() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [coordinates, setCoordinates] = useState("");

  const handleCoordinatesChange = (event) => {
    setCoordinates(event.target.value);
  };

  const handleGetWeather = () => {
    fetch("magnificent-rejoicing-production.up.railway.app:5000/api/get-weather-from-location", {
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
        fetch("magnificent-rejoicing-production.up.railway.app:5000/api/predict", {
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

  return (
    <>
      <div>
        <label htmlFor="coordinates">Enter Coordinates:</label>
        <input
          type="text"
          id="coordinates"
          value={coordinates}
          onChange={handleCoordinatesChange}
        />
        <button onClick={handleGetWeather}>Get Weather</button>
      </div>
      {prediction && (
        <>
          <h1>Weather Data</h1>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
          <h1>Prediction</h1>
          <pre>There is {prediction[1] * 100}% a fire</pre>
        </>
      )}
    </>
  );
}
