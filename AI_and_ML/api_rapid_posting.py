import requests
import random
import json

# --- Configuration ---
# Base URL - The vaccine_id will be appended to this
BASE_URL = "http://localhost:8000/api/centre_vaccine"

# !!! REPLACE THIS WITH YOUR ACTUAL BEARER TOKEN !!!
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTBlMzliZjA3OGE0NDgxZTNjNjk2YTUiLCJyb2xlIjoidmFjY19jZW50cmUiLCJ2Y19pZCI6IlZDXzEwMDA5IiwiaWF0IjoxNzYyNTQ3NDQ4LCJleHAiOjE3NjMxNTIyNDh9.gm6WzAmOGiBrmzSAq6cqFKxDL63VKh1S4Ckc1_6rNak"




HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

# The full list of 13 vaccines provided
VACCINES = [
  {
    "centre_vaccine_id": "690e4a75078a4481e3c69911",
    "name": "BCG"
  },
  {
    "centre_vaccine_id": "690e4a75078a4481e3c69914",
    "name": "Pentavalent"
  },
  {
    "centre_vaccine_id": "690e4a76078a4481e3c69917",
    "name": "PCV"
  },
  {
    "centre_vaccine_id": "690e4a76078a4481e3c6991a",
    "name": "OPV"
  },
  {
    "centre_vaccine_id": "690e4a77078a4481e3c6991d",
    "name": "MR"
  },
  {
    "centre_vaccine_id": "690e4a77078a4481e3c69920",
    "name": "Measles"
  },
  {
    "centre_vaccine_id": "690e4a77078a4481e3c69923",
    "name": "TT"
  },
  {
    "centre_vaccine_id": "690e4ad8078a4481e3c69998",
    "name": "Rotavirus"
  },
  {
    "centre_vaccine_id": "690e4ad9078a4481e3c6999b",
    "name": "MMR"
  },
  {
    "centre_vaccine_id": "690e4ad9078a4481e3c6999e",
    "name": "Varicella"
  },
  {
    "centre_vaccine_id": "690e4ad9078a4481e3c699a1",
    "name": "Hepatitis A"
  },
  {
    "centre_vaccine_id": "690e4ad9078a4481e3c699a4",
    "name": "Typhoid"
  },
  {
    "centre_vaccine_id": "690e4ada078a4481e3c699a7",
    "name": "Influenza"
  }
]

print(f"🚀 Starting stock updates for {len(VACCINES)} vaccines...\n")

success_count = 0

for vac in VACCINES:
    # 1. Construct the specific URL for this vaccine
    # Format: http://localhost:8000/api/centre_vaccine/{vaccine_id}/stock
    url = f"{BASE_URL}/{vac['centre_vaccine_id']}/stock"

    # 2. Generate random stock amount between 1 and 100
    random_amount = random.randint(0, 100)

    # 3. Create payload
    payload = {
        "operation": "add",
        "amount": random_amount
    }

    try:
        # 4. Send POST request with headers
        response = requests.put(url, json=payload, headers=HEADERS)

        # 5. Check results
        if response.status_code in [200, 201]:
            print(f"✅ Added {random_amount} units to {vac['name']}")
            success_count += 1
        elif response.status_code in [401, 403]:
             print(f"⛔ Auth Failed for {vac['name']}: Check token!")
             break
        else:
            print(f"❌ Failed: {vac['name']} (Status: {response.status_code}) - {response.text}")

    except Exception as e:
        print(f"🚨 Connection Error for {vac['name']}: {e}")
        break

print(f"\n✨ Completed! Updated stock for {success_count}/{len(VACCINES)} vaccines.")