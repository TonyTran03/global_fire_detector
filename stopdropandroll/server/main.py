from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from flask_cors import CORS
# Enable CORS
# Load the trained model
model = tf.keras.models.load_model('ArtificialFirePredictor.keras')

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

FIRE = 255
NO_FIRE = 0
WATER = -1
BURNED = -2

value = 0
closestWater = 1
closestFire = 2
terrainFlamability = 3
flamableDensity = 4
windSpeed = 5
temperature = 6
humidity = 7
rain = 8
terrainSlope = 9
ticksLit = 10
burned = 11



def closest_fire(grid, N):
    fire_positions = [(i, j) for i in range(N) for j in range(N) if grid[i][j][value] == FIRE]
    for i in range(N):
        for j in range(N):
            closest_fire = min(max(abs(k-i), abs(l-j)) for k, l in fire_positions)
            grid[i][j][closestFire] = closest_fire
    return grid

def initial_grid(N, on_positions):
    grid = np.zeros((N, N), dtype=[('value', 'i4'), ('closestWater', 'i4'), ('closestFire', 'i4'),
                                   ('terrainFlamability', 'f4'), ('flamableDensity', 'f4'),
                                   ('windSpeed', 'i4'), ('temperature', 'i4'), ('humidity', 'i4'),
                                   ('rain', 'i4'), ('terrainSlope', 'i4'), ('ticksLit', 'i4'),
                                   ('burned', 'b')])
    for i in range(N):
        for j in range(N):
            grid[i][j] = (NO_FIRE, 0, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)
    for pos in on_positions:
        grid[pos] = (FIRE, 10, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)

    closest_fire(grid, N)
    return grid


# @app.route("/api/next-fire", methods=["POST"])
# def next_fire():

#     data = request.get_json()
#     grid = data["grid"]
#     N = len(grid)
#     num_ticks = data["num_ticks"]
#     windDirection = 1

#     newGrid = grid.copy()
#     grids = []
#     for _ in range(num_ticks):
#         newGrid = newGrid.copy()
#         for i in range(N):
#             for j in range(N):
#                 print(newGrid[i][j])
#                 total_fire_neighbors = np.sum(grid[(i + di) % N][(j + dj) % N][value] == FIRE
#                                 for di in range(-1, 2) for dj in range(-1, 2) if (di, dj) != (0, 0))

#                 if newGrid[i][j][value] == FIRE:
#                   flammability_factor = newGrid[i][j][terrainFlamability] * (1 - newGrid[i][j][humidity] / 100)
#                   wind_factor = (1 + newGrid[i][j][windSpeed] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
#                   temperature_factor = 1 + (newGrid[i][j][temperature] - 30) / 100
#                   rain_factor = 1 - newGrid[i][j][rain] / 100
#                   slope_factor = 1 + newGrid[i][j][terrainSlope] / 10
#                   extinguish_probability = 0.1 * (1 - flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor)

#                   if grid[i][j][ticksLit] > 1000000000 or np.random.rand() < extinguish_probability:
#                     newGrid[i][j][value] = NO_FIRE
#                     newGrid[i][j][burned] = True
#                   else:
#                     newGrid[i][j][ticksLit] += 1
#                 else:
#                   if total_fire_neighbors > 5 or newGrid[i][j][closestFire] < 2 and not newGrid[i][j][burned]:
#                     flammability_factor = newGrid[i][j][terrainFlamability] * (1 - newGrid[i][j][humidity] / 100)
#                     wind_factor = (1 + newGrid[i][j][windSpeed] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
#                     temperature_factor = 1 + (newGrid[i][j][temperature] - 30) / 100
#                     rain_factor = 1 - newGrid[i][j][rain] / 100
#                     slope_factor = 1 + newGrid[i][j][terrainSlope] / 10
#                     ignition_probability = 0.1 * flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor
#                     if np.random.rand() < ignition_probability:
#                       newGrid[i][j][value] = FIRE
#                       newGrid[i][j][ticksLit] = 0

#                 closest_fire(newGrid, N)
#                 grids.append(newGrid.copy())
#                 grid = newGrid.copy()
#     return jsonify({"grids": [g for g in grids]})

@app.route("/api/next-fire", methods=["POST"])
def next_fire():

    data = request.get_json()
    grid = data["grid"]
    N = len(grid)
    num_ticks = data["num_ticks"]
    windDirection = 1

    newGrid = grid.copy()
    grids = []
    for _ in range(num_ticks):
        newGrid = newGrid.copy()
        for i in range(N):
            for j in range(N):
                total_fire_neighbors = np.sum(grid[(i + di) % N][(j + dj) % N][value] == FIRE
                                for di in range(-1, 2) for dj in range(-1, 2) if (di, dj) != (0, 0))

                if newGrid[i][j][value] == FIRE:
                  if grid[i][j][ticksLit] > 1000000000 or np.random.rand() < 0.1:
                    newGrid[i][j][value] = NO_FIRE
                    newGrid[i][j][burned] = True
                  else:
                    newGrid[i][j][ticksLit] += 1
                else:
                  if total_fire_neighbors > 5 or newGrid[i][j][closestFire] < 2 and not newGrid[i][j][burned]:
                    ignition_probability = 0.1
                    if np.random.rand() < ignition_probability:
                      newGrid[i][j][value] = FIRE
                      newGrid[i][j][ticksLit] = 0

                grids.append(newGrid.copy())
                grid = newGrid.copy()
    return jsonify({"grids": [g for g in grids]})



@app.route("/api/get-grid", methods=["POST"])
def get_grid():
    data = request.get_json()
    N = data["N"]
    on_positions = data["on_positions"]

    on_positions = [tuple(pos) for pos in on_positions]
    
    grid = initial_grid(N, on_positions)
    return jsonify({"grid": grid.tolist()})

# Define a route to handle prediction requests
@app.route('/api/predict', methods=['POST'])
def predict():
    # Extract input data from the POST request
    data = request.get_json()

    # Assuming input data is a list of 9 features (make sure the data format matches)
    # Check if all features are numbers/floats
    print("")
    # Convert the features to a dataframe with one row
    features_df = pd.DataFrame([data['features']], columns=data['features'].keys())
    print(features_df)
    print("")
    
    # Use the model to make a prediction
    prediction = model.predict(features_df)

    print(prediction)

    # Check if the prediction is below 20%
    if prediction[0][1] < 0.2 or prediction[0][1] > 0.85:
        # Leave the prediction as it is
        prediction[0][1] = prediction[0][1]
    else:
        # Curve the prediction above 20% and move it down to skew it downward
        prediction[0][1] = (prediction[0][1] - 0.1) * 0.9

    # Convert the prediction to a list and return it as JSON
    prediction = prediction.tolist()
    return jsonify({'prediction': prediction})

import requests
import json

@app.route('/api/get-weather-from-location', methods=['POST'])
def get_weather_from_location():
    d = request.get_json()
 
    _url1 = "https://api.tomorrow.io/v4/weather/realtime?location="
    # _location = "43.664251, -79.397882" # this should be dynamic
    _location = d["location"]
    # _url2 = "&apikey=Zqy6hZTbX7mxbLlOkE6avAQK45bPhPUj"
    _url2 = "&apikey=YdpkyIr52j5IKKVMw1bhQMbT9e2VXQPC"

    _fullURL = _url1 + _location + _url2
    req = requests.get(_fullURL)
    data = req.json()

    values = data.get("data", {}).get("values", {})

    desired_keys = ["temperature", "windGust", "windSpeed", "windDirection", "rainIntensity", "humidity"]

    filtered_data = {key: values[key] for key in desired_keys if key in values}

    print(filtered_data)
    return jsonify(filtered_data)

import openmeteo_requests

import requests_cache
import pandas as pd
from retry_requests import retry
import math

cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)


@app.route('/api/get-heatmap-data', methods=['POST'])
def get_heatmap_data():
    data = request.get_json()
    latitude = data["latitude"]
    longitude = data["longitude"]
    radius = 0.01  # radius of the circle in degrees

    num_points = 20  # number of points to generate

    # Create a list to store the coordinates
    coordinates = []

    # Generate the coordinates
    while radius > 0:
        # Calculate the angular distance between each point
        angular_distance = 360.0 / num_points

        # Generate the coordinates
        for i in range(num_points):
            angle = math.radians(i * angular_distance)
            dx = radius * math.cos(angle)
            dy = radius * math.sin(angle)
            longitude = longitude + dx
            latitude = latitude + dy
            coordinates.append((longitude, latitude))

        # Decrease the radius
        radius -= 0.002

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
	    "current": ["temperature_2m", "relative_humidity_2m", "rain", "wind_speed_10m", "wind_direction_10m"],
	    "forecast_days": 1
    }
    conditions = {}

    for coordinate in coordinates:
        print(coordinate)
        latitude, longitude = coordinate
        params["latitude"] = latitude
        params["longitude"] = longitude

        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        current = response.Current()

        current_temperature_2m = current.Variables(0).Value()

        current_relative_humidity_2m = current.Variables(1).Value()

        current_rain = current.Variables(2).Value()

        current_wind_speed_10m = current.Variables(3).Value()

        current_wind_direction_10m = current.Variables(4).Value()

        conditions[str((latitude, longitude))] = {
            "temperature": current_temperature_2m,
            "humidity": current_relative_humidity_2m,
            "rain": current_rain,
            "wind_speed": current_wind_speed_10m,
            "wind_direction": current_wind_direction_10m
        }

    return jsonify(conditions)

@app.route('/api/get-riskmap-data', methods=['POST'])
def get_riskmap_data():
    print("Getting riskmap data")
    data = request.get_json()
    latitude = data["latitude"]
    longitude = data["longitude"]
    month = data["month"]
    radius = 0.01  # radius of the circle in degrees

    num_points = 20  # number of points to generate

    # Create a list to store the coordinates
    coordinates = []

    # Generate the coordinates
    while radius > 0:
        # Calculate the angular distance between each point
        angular_distance = 360.0 / num_points
        # Generate the coordinates
        for i in range(num_points):
            angle = math.radians(i * angular_distance)
            dx = radius * math.cos(angle)
            dy = radius * math.sin(angle)
            longitude = longitude + dx
            latitude = latitude + dy
            coordinates.append((longitude, latitude))

        # Decrease the radius
        radius -= 0.002
        # Generate the coordinates
        for i in range(num_points):
            angle = math.radians(i * angular_distance)
            dx = radius * math.cos(angle)
            dy = radius * math.sin(angle)
            longitude = longitude + dx
            latitude = latitude + dy
            coordinates.append((longitude, latitude))

        # Decrease the radius
        radius -= 0.002

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
	    "current": ["temperature_2m", "relative_humidity_2m", "rain", "wind_speed_10m", "wind_direction_10m"],
	    "forecast_days": 1
    }
    conditions = {}

    for coordinate in coordinates:
        print(coordinate)
        latitude, longitude = coordinate
        params["latitude"] = longitude # swap since it's true
        params["longitude"] = latitude

        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        current = response.Current()

        current_temperature_2m = current.Variables(0).Value()

        current_relative_humidity_2m = current.Variables(1).Value()

        current_rain = current.Variables(2).Value()

        current_wind_speed_10m = current.Variables(3).Value()
        
        # Use the model to make a prediction
        d = {
            "month": month,
            "temp": current_temperature_2m,
            "RH": current_relative_humidity_2m,
            "wind": current_wind_speed_10m,
            "rain": current_rain,
        }

        # Wrap `d` inside a list to indicate it as a single row of data
        df = pd.DataFrame([d])

        prediction = model.predict(df)

        print(prediction)

        # Check if the prediction is below 20%
        if prediction[0][1] < 0.2 or prediction[0][1] > 0.85:
            # Leave the prediction as it is
            prediction[0][1] = prediction[0][1]
        else:
            # Curve the prediction above 20% and move it down to skew it downward
            prediction[0][1] = (prediction[0][1] - 0.1) * 0.9

        # Convert the prediction to a list and return it as JSON
        prediction = prediction.tolist()

        conditions[str((latitude, longitude))] = prediction[0][1]

    return jsonify(conditions)
    


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
