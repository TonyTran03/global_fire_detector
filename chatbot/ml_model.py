from tensorflow.keras.models import load_model
import numpy as np

model = load_model('ml_creation/Notebooks/PrimeFirePredictor.keras')


def predict_fire_risk():
    features = np.array([
        weather_data['temperature'],
        weather_data['windGust'],
        weather_data['windSpeed'],
        weather_data['windDirection'],
        weather_data['rainIntensity']
    ]).reshape(1, -1) 

    prediction = model.predict(features)

    if prediction[0][0] > 0.5:
        return "No Fire"
    else:
        return "Fire"
