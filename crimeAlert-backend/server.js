const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockAlerts = [
  {
    id: '1',
    type: 'Theft',
    message: 'Package theft reported on Main Street',
    latitude: 40.7128,
    longitude: -74.0060,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'high',
    isRead: false
  },
  {
    id: '2',
    type: 'Breaking & Entering',
    message: 'Attempted break-in at residential area',
    latitude: 40.7150,
    longitude: -74.0085,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: 'high',
    isRead: false
  },
  {
    id: '3',
    type: 'Suspicious Activity',
    message: 'Suspicious person loitering near park',
    latitude: 40.7100,
    longitude: -74.0040,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    severity: 'medium',
    isRead: false
  },
  {
    id: '4',
    type: 'Vandalism',
    message: 'Property vandalism reported',
    latitude: 40.7180,
    longitude: -74.0100,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: 'low',
    isRead: true
  }
];

// Routes
app.get('/api/alerts', (req, res) => {
  try {
    res.json(mockAlerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.get('/api/alerts/:id', (req, res) => {
  try {
    const alert = mockAlerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

app.post('/api/alerts', (req, res) => {
  try {
    const { type, message, latitude, longitude, severity } = req.body;
    
    if (!type || !message || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAlert = {
      id: String(mockAlerts.length + 1),
      type,
      message,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      severity: severity || 'medium',
      isRead: false
    };

    mockAlerts.unshift(newAlert);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

app.put('/api/alerts/:id/read', (req, res) => {
  try {
    const alert = mockAlerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    alert.isRead = true;
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Crime Alert Backend running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});
