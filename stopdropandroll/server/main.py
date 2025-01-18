from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd

# Load the trained model
model = tf.keras.models.load_model('PrimeFirePredictor.keras')

# Initialize the Flask application
app = Flask(__name__)

FIRE = 255
NO_FIRE = 0
WATER = -1
BURNED = -2


def closest_fire(grid, N):
    fire_positions = [(i, j) for i in range(N) for j in range(N) if grid[i, j]["value"] == FIRE]
    for i in range(N):
        for j in range(N):
            closest_fire = min(max(abs(k-i), abs(l-j)) for k, l in fire_positions)
            grid[i, j]["closestFire"] = closest_fire
    return grid

def initial_grid(N, on_positions):
    grid = np.zeros((N, N), dtype=[('value', 'i4'), ('closestWater', 'i4'), ('closestFire', 'i4'),
                                   ('terrainFlamability', 'f4'), ('flamableDensity', 'f4'),
                                   ('windSpeed', 'i4'), ('temperature', 'i4'), ('humidity', 'i4'),
                                   ('rain', 'i4'), ('terrainSlope', 'i4'), ('ticksLit', 'i4'),
                                   ('burned', 'b')])
    for i in range(N):
        for j in range(N):
            grid[i, j] = (NO_FIRE, 0, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)
    for pos in on_positions:
        grid[pos] = (FIRE, 10, 0, 0.8, 0.5, 5, 35, 20, 0, 3, 0, False)

    closest_fire(grid, N)
    return grid


@app.route("/api/next-fire", methods=["POST"])
def next_fire():

    data = request.get_json()
    grid = data["grid"]
    N = data["N"]
    num_ticks = data["num_ticks"]
    windDirection = 1

    newGrid = grid.copy()
    grids = []
    for _ in range(num_ticks):
        newGrid = newGrid.copy()
        for i in range(N):
            for j in range(N):
                total_fire_neighbors = sum(grid[(i + di) % N, (j + dj) % N]["value"] == FIRE
                                           for di in range(-1, 2) for dj in range(-1, 2) if (di, dj) != (0, 0))

                if newGrid[i, j]["value"] == FIRE:
                    flammability_factor = newGrid[i, j]["terrainFlamability"] * (1 - newGrid[i, j]["humidity"] / 100)
                    wind_factor = (1 + newGrid[i, j]["windSpeed"] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
                    temperature_factor = 1 + (newGrid[i, j]["temperature"] - 30) / 100
                    rain_factor = 1 - newGrid[i, j]["rain"] / 100
                    slope_factor = 1 + newGrid[i, j]["terrainSlope"] / 10
                    extinguish_probability = 0.01 * (1 - flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor)
                    
                    if grid[i, j]["ticksLit"] > 1000000000 or np.random.rand() < extinguish_probability:
                        newGrid[i, j]["value"] = NO_FIRE
                        newGrid[i, j]["burned"] = True
                    else:
                        newGrid[i, j]["ticksLit"] += 1
                else:
                    if total_fire_neighbors > 5 or newGrid[i, j]["closestFire"] < 2 and not newGrid[i, j]["burned"]:
                        flammability_factor = newGrid[i, j]["terrainFlamability"] * (1 - newGrid[i, j]["humidity"] / 100)
                        wind_factor = (1 + newGrid[i, j]["windSpeed"] / 10) * (1 if windDirection in [(i+1)%8, (i-1)%8] else 0.5)
                        temperature_factor = 1 + (newGrid[i, j]["temperature"] - 30) / 100
                        rain_factor = 1 - newGrid[i, j]["rain"] / 100
                        slope_factor = 1 + newGrid[i, j]["terrainSlope"] / 10
                        ignition_probability = 0.01 * flammability_factor * wind_factor * temperature_factor * rain_factor * slope_factor
                        if np.random.rand() < ignition_probability:
                            newGrid[i, j]["value"] = FIRE
                            newGrid[i, j]["ticksLit"] = 0

        closest_fire(newGrid, N)
        grids.append(newGrid.copy())
        grid = newGrid.copy()
    return jsonify({"grids": [g.tolist() for g in grids]})

@app.route("/api/get-grid", methods=["POST"])
def get_grid():
    data = request.get_json()
    N = data["N"]
    on_positions = data["on_positions"]
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

    # Return the prediction result as JSON
    return jsonify({'prediction': prediction.tolist()})

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
