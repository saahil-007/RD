import requests

def get_coordinates(village, district, state):
    query = f"{village}, {district}, {state}, India"
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }
    response = requests.get(url, params=params)
    data = response.json()
    if data:
        return {
            "latitude": data[0]["lat"],
            "longitude": data[0]["lon"]
        }
    return None