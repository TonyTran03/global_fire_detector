import json

file_name = "ml_creation/APIendpoints/realtimeExtracted.json"
def get_weather_data_from_file(file_name):
    try:
        with open(file_name, "r") as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print(f"Error: File {file_name} not found.")
        return {
            "temperature": 0,
            "windGust": 0,
            "windSpeed": 0,
            "windDirection": 0,
            "rainIntensity": 0
        }
