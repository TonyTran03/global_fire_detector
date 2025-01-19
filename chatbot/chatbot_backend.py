from flask import Flask, request, jsonify, render_template
import requests
from ml_model import predict_fire_risk
from weather_data import get_weather_data_from_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

_OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not _OPENAI_API_KEY:
    raise ValueError("OpenAI API key is not set. Please check your .env file.")

logging.basicConfig(level=logging.ERROR)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    
    user_message = request.json.get('message', '')

    try:
        weather_info = get_weather_data_from_file()
        if not weather_info:
            return jsonify({'error': 'Unable to retrieve weather data.'}), 500

        fire_risk = predict_fire_risk(weather_info)
        if fire_risk is None:
            return jsonify({'error': 'Failed to calculate fire risk.'}), 500

        system_prompt = (
            """You are a chatbot that provides information about forest fire risks and predictions based on user 
            queries. You must help users determine how to best evacuate if they are at a high risk of being impacted 
            by the fires. """
            f"Current fire risk: {fire_risk}. Weather conditions: {weather_info}."
        )

        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {_OPENAI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-4',
                'messages': [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        response.raise_for_status()
        response_data = response.json()
        bot_reply = response_data.get('choices', [{}])[0].get('message', {}).get('content', 'No reply available.')
        return jsonify({'reply': bot_reply})

    except requests.exceptions.RequestException as e:
        logging.error(f"Error communicating with OpenAI API: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
