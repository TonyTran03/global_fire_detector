import { useEffect, useState } from "react";

const useGetConditions = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [coordinates, setCoordinates] = useState("");

    const handleCoordinatesChange = (event) => {
        setCoordinates(event.target.value);
    };

    const handleGetWeather = () => {
        fetch("http://localhost:5000/api/get-weather-from-location", {
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
                fetch("http://localhost:5000/api/predict", {
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

    return {
        weatherData,
        prediction,
        coordinates,
        handleCoordinatesChange,
        handleGetWeather,
    };
};

export default useGetConditions;
