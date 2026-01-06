# BMTC Bus Tracker - Setup Guide

## Problem
The BMTC API has CORS (Cross-Origin Resource Sharing) restrictions that prevent direct calls from the browser.

## Solution
Use a local proxy server to handle all API requests.

## Setup Instructions

### Step 1: Install Node.js
If you don't have Node.js installed, download and install it from: https://nodejs.org/

### Step 2: Install Dependencies
Open a terminal/command prompt in the Friends of BMTC folder and run:

```bash
npm install
```

This will install all required packages listed in `package.json`:
- express
- cors
- body-parser
- node-fetch

### Step 3: Start the Proxy Server
Run the following command in the same folder:

```bash
npm start
```

You should see output like:
```
BMTC API Proxy running on http://localhost:3000
Health check: http://localhost:3000/api/health
```

### Step 4: Open the Website
Open your website in a browser (e.g., http://127.0.0.1:5500/)

The tracker page will now work without CORS errors!

---

## How It Works

```
Browser (Tracker Page)
    ↓
    → Calls http://localhost:3000/api/vehicles/search
    ↓
Proxy Server (api-proxy.js)
    ↓
    → Calls https://bmtcmobileapi.karnataka.gov.in/WebAPI/ListVehicles
    ↓
BMTC API Server
    ↓
    → Returns vehicle data
    ↓
Proxy Server
    ↓
    → Forwards response to Browser
    ↓
Browser displays results
```

---

## Troubleshooting

### "Error: Error: Failed to search vehicles. Make sure the proxy server is running on localhost:3000"
- The proxy server is not running
- Start it with: `npm start`
- Make sure it says "BMTC API Proxy running on http://localhost:3000"

### Port 3000 already in use?
Edit `api-proxy.js` and change:
```javascript
const PORT = process.env.PORT || 3000;
```
To:
```javascript
const PORT = process.env.PORT || 3001;
```

Then update the proxy URL in `tracker.html`:
```javascript
const API_PROXY_URL = "http://localhost:3001/api";
```

### Still getting errors?
1. Check browser console (F12 → Console tab)
2. Check proxy server console for error messages
3. Verify BMTC API is accessible by visiting:
   https://bmtcmobileapi.karnataka.gov.in/WebAPI/ListVehicles (will show CORS error, which is expected)

---

## Features

✅ Search vehicles by number - autocomplete dropdown with 10 matches
✅ Real-time location tracking on map
✅ Trip details (route, status, arrival/departure times)
✅ Bilingual support (English/Kannada)
✅ Dark theme with modern design

---

## API Endpoints

The proxy forwards requests to:

1. **List Vehicles**: `POST /api/vehicles/search`
   - Body: `{ vehicleRegNo: "0979" }`
   - Response: List of matching vehicles with IDs

2. **Vehicle Details**: `POST /api/vehicles/details`
   - Body: `{ vehicleId: 27074 }`
   - Response: Trip details, location, and route info
