import pickle # is it a pickle file?

with open("ml_model_name.pkl", "rb"):
    model = pickle.load(filename)


def predict_fire_risk():
    features = [
        weather_data['temperature'],
        weather_data['windGust'],
        weather_data['windSpeed'],
        weather_data['windDirection'],
        weather_data['rainIntensity']
    ]

    risk = model.predict([features])[0]
    return risk
