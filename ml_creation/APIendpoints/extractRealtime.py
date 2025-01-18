import json

file_name = "realtime43.664251, -79.397882_full_daily.json"

with open(file_name, "r") as file:
    data = json.load(file)

values = data.get("data", {}).get("values", {})

desired_keys = ["temperature", "windGust", "windSpeed", "windDirection", "rainIntensity"]

filtered_data = {key: values[key] for key in desired_keys if key in values}

with open("realtimeExtracted.json", 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=4)

print("filtered data saved to 'realtimeExtracted.json'.")