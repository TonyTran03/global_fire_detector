from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

OPENAI_API_KEY = 'your-openai-api-key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-4',  # replace with model version if we wanna change it
                'messages': [
                    {"role": "system", "content": "You are a chatbot that provides information about forest fire risks and predictions based on user queries."},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        response.raise_for_status()
        bot_reply = response.json()['choices'][0]['message']['content']
        return jsonify({'reply': bot_reply})

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with OpenAI API: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
