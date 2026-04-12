import requests

url = "http://localhost:8001/health"
headers = {
    "Origin": "http://localhost:3001",
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "X-API-Key"
}

try:
    response = requests.options(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Headers: {response.headers}")
except Exception as e:
    print(f"Error: {e}")
