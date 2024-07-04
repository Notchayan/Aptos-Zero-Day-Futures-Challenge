import csv
import requests
import time

# Define the API endpoint
url = 'http://127.0.0.1:8000/placeLimitOrder?InstrumentToken=5001'

# Read data from the CSV file
with open('./test.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    
    # Skip the header row if it exists
    next(reader, None)

    # Iterate over rows in the CSV file
    for row in reader:
        # Extract data from the row
        privKey, amount, price, timestamp, date, side, leverage = row

        # Convert side to boolean
        side = side.lower() == 'true'

        # Prepare the payload
        payload = {
            "InstrumentToken": "5001",
            "privKey": privKey,
            "amount": int(amount),
            "price": int(price),
            "timestamp": int(timestamp),
            "date": int(date),
            "side": side,
            "leverage": int(leverage)
        }

        # Make the POST request
        response = requests.post(url, json=payload, headers={'accept': 'application/json', 'Content-Type': 'application/json'})

        # Print the response
        print(f"Response for {privKey}: {response.status_code}, {response.text}")

        # Sleep for 0.25 seconds
        time.sleep(0.25)
