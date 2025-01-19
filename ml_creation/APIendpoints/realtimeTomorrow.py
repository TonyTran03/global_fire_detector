import requests
import json

_url1 = "https://api.tomorrow.io/v4/weather/realtime?location="
_location = "toronto" # this should be dynamic
_url2 = "&apikey=Zqy6hZTbX7mxbLlOkE6avAQK45bPhPUj"

_fullURL = _url1 + _location + _url2
request = requests.get(_fullURL)
data = request.json()

with open(('realtimeTEST' + _location + '.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

