// Simple Express proxy server to handle BMTC API requests
// Install dependencies: npm install express cors body-parser node-fetch

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// BMTC API base URL
const BMTC_API_URL = 'https://bmtcmobileapi.karnataka.gov.in/WebAPI';

// Headers that work with the BMTC API (matching the Python script approach)
const API_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json;charset=UTF-8',
  'Origin': 'https://mymbtc.karnataka.gov.in',
  'Referer': 'https://mymbtc.karnataka.gov.in/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
};

// Load vehicle data from JSON files
function loadVehicleDataFromFile(region = 'KA') {
  try {
    const filePath = path.join(__dirname, `data/vehicle_list_${region}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading vehicle data from ${region}:`, error.message);
  }
  return null;
}

// Search in local vehicle data
function searchVehiclesLocal(vehicleRegNo, region = 'KA') {
  const vehicleData = loadVehicleDataFromFile(region);
  if (!vehicleData || !vehicleData.data) {
    return null;
  }

  const query = String(vehicleRegNo).toUpperCase().trim();
  const results = vehicleData.data.filter(vehicle => {
    const regNo = String(vehicle.vehicleregno || vehicle.vehicleRegNo || '').toUpperCase().trim();
    return regNo.includes(query);
  });

  if (results.length > 0) {
    return {
      Issuccess: true,
      data: results.slice(0, 10).map(vehicle => ({
        vehicleId: vehicle.vehicleid,
        vehicleRegNo: vehicle.vehicleregno,
        vehicleRegno: vehicle.vehicleregno
      }))
    };
  }

  return null;
}

// Get vehicle from local data by ID
function getVehicleById(vehicleId, region = 'KA') {
  const vehicleData = loadVehicleDataFromFile(region);
  if (!vehicleData || !vehicleData.data) {
    return null;
  }

  const id = parseInt(vehicleId);
  const vehicle = vehicleData.data.find(v => v.vehicleid === id);
  return vehicle || null;
}

// Generate mock trip data for vehicles with no live tracking
function generateMockTripData(vehicleId, vehicleRegNo) {
  const routes = [
    { name: 'Indiranagar', destination: 'Whitefield', status: 'Running' },
    { name: 'Jayanagar', destination: 'MG Road', status: 'Running' },
    { name: 'Koramangala', destination: 'Silk Board', status: 'Running' },
    { name: 'Vijayanagar', destination: 'Lalbagh', status: 'Running' },
    { name: 'Yeshwantpur', destination: 'KR Market', status: 'Running' },
    { name: 'HSR Layout', destination: 'BTM Layout', status: 'Running' }
  ];

  const randomRoute = routes[Math.floor(Math.random() * routes.length)];
  const baseLatitude = 12.9716;
  const baseLongitude = 77.5946;
  const offsetLat = (Math.random() - 0.5) * 0.15;
  const offsetLng = (Math.random() - 0.5) * 0.15;

  console.log(`Generated mock data for ${vehicleRegNo}`);

  return {
    success: true,
    Issuccess: true,
    routeDetails: [
      {
        vehicleId: vehicleId,
        vehicleRegNo: vehicleRegNo,
        routeName: randomRoute.name,
        destinationStationName: randomRoute.destination,
        tripStatus: randomRoute.status,
        actual_arrivaltime: '14:30',
        actual_departuretime: '13:15',
        stopStatus_distance: Math.random() * 25,
        livelocation: [
          {
            latitude: baseLatitude + offsetLat,
            longitude: baseLongitude + offsetLng
          }
        ]
      }
    ]
  };
}

// Proxy for ListVehicles endpoint
app.post('/api/vehicles/search', async (req, res) => {
  try {
    const { vehicleRegNo } = req.body;

    if (!vehicleRegNo) {
      return res.status(400).json({ error: 'vehicleRegNo is required' });
    }

    console.log(`Searching for vehicle: ${vehicleRegNo}`);

    // First try to search in local vehicle data
    const localResults = searchVehiclesLocal(vehicleRegNo);
    if (localResults) {
      console.log(`Found ${localResults.data.length} vehicles locally`);
      return res.json(localResults);
    }

    console.log('No local results, trying BMTC API...');

    // Fall back to BMTC API
    const response = await fetch(`${BMTC_API_URL}/ListVehicles`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({ vehicleRegNo })
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in /api/vehicles/search:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch vehicles',
      message: error.message 
    });
  }
});

// Proxy for VehicleTripsDetails endpoint
app.post('/api/vehicles/details', async (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ error: 'vehicleId is required' });
  }

  try {
    const response = await fetch(
      `${BMTC_API_URL}/VehicleTripDetails_v2`,
      {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ vehicleId: parseInt(vehicleId) })
      }
    );

    if (!response.ok) {
      throw new Error(`BMTC API failed with status ${response.status}`);
    }

    const data = await response.json();

    // ✅ Return RAW BMTC response exactly as received
    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Vehicle details error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// Extract live location data from vehicle details
function extractLiveLocationData(vehicleData) {
  try {
    if (!vehicleData || !vehicleData.routeDetails) {
      return null;
    }

    const liveData = [];
    
    vehicleData.routeDetails.forEach(route => {
      // Extract vehicle information
      const vehicleInfo = {
        vehicleId: route.vehicleId,
        vehicleRegNo: route.vehicleRegNo,
        routeName: route.routeName,
        destinationStationName: route.destinationStationName,
        tripStatus: route.tripStatus,
        arrivalTime: route.actual_arrivaltime,
        departureTime: route.actual_departuretime,
        distance: route.stopStatus_distance
      };

      // Extract live location if available
      if (route.livelocation && route.livelocation.length > 0) {
        const location = route.livelocation[0];
        vehicleInfo.location = {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          timestamp: new Date().toISOString()
        };
      }

      liveData.push(vehicleInfo);
    });

    return liveData;
  } catch (error) {
    console.error('Error extracting live location data:', error.message);
    return null;
  }
}

// Live location data endpoint
app.post('/api/vehicles/live', async (req, res) => {
  try {
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ error: 'vehicleId is required' });
    }

    console.log(`\n=== Live Location Request ===`);
    console.log(`Vehicle ID: ${vehicleId}`);

    const payload = { vehicleId: parseInt(vehicleId) };

    const response = await fetch(`${BMTC_API_URL}/VehicleTripsDetails_v2`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.log(`API response status: ${response.status}`);
      const localVehicle = getVehicleById(vehicleId);
      if (localVehicle) {
        console.log(`Vehicle found locally, generating mock location`);
        const mockData = generateMockTripData(parseInt(vehicleId), localVehicle.vehicleregno);
        const liveLocation = extractLiveLocationData(mockData);
        return res.json({
          success: true,
          data: liveLocation,
          source: 'mock'
        });
      }
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log(`Live data received from API`);

    // Extract live location data
    const liveLocation = extractLiveLocationData(data);
    
    res.json({
      success: true,
      data: liveLocation,
      source: 'live',
      rawData: data
    });
  } catch (error) {
    console.error('Error in /api/vehicles/live:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch live location',
      message: error.message 
    });
  }
});

// Bulk live location data for multiple vehicles
app.post('/api/vehicles/live-batch', async (req, res) => {
  try {
    const { vehicleIds } = req.body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return res.status(400).json({ error: 'vehicleIds array is required' });
    }

    console.log(`\n=== Batch Live Location Request ===`);
    console.log(`Requesting ${vehicleIds.length} vehicles`);

    const results = [];
    
    for (const vehicleId of vehicleIds) {
      try {
        const payload = { vehicleId: parseInt(vehicleId) };
        const response = await fetch(`${BMTC_API_URL}/VehicleTripsDetails_v2`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const liveLocation = extractLiveLocationData(data);
          if (liveLocation && liveLocation.length > 0) {
            results.push({
              vehicleId,
              success: true,
              data: liveLocation,
              source: 'live'
            });
          }
        } else {
          const localVehicle = getVehicleById(vehicleId);
          if (localVehicle) {
            const mockData = generateMockTripData(parseInt(vehicleId), localVehicle.vehicleregno);
            const liveLocation = extractLiveLocationData(mockData);
            results.push({
              vehicleId,
              success: true,
              data: liveLocation,
              source: 'mock'
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching vehicle ${vehicleId}:`, error.message);
        results.push({
          vehicleId,
          success: false,
          error: error.message
        });
      }
    }

    console.log(`Batch request completed: ${results.length} results`);
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error in /api/vehicles/live-batch:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch live locations',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BMTC API Proxy is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`BMTC API Proxy running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
