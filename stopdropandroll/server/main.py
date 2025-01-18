from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd

# Load the trained model
model = tf.keras.models.load_model('PrimeFirePredictor.keras')

# Initialize the Flask application
app = Flask(__name__)

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
