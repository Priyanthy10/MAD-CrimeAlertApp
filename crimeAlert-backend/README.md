# Crime Alert Backend API

Backend API server for the Crime Alert App.

## TODO: Setup

This backend is not yet implemented. To get started:

1. Initialize Node.js project:

```bash
npm init -y
```

2. Install dependencies:

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install -D nodemon
```

3. Create the following structure:

```
crimeAlert-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── .env
├── server.js
└── package.json
```

## Planned Features

- User authentication (JWT)
- Zone CRUD operations
- Alert management
- Real-time notifications
- Geofencing logic
- RESTful API endpoints

## Environment Variables

Create a `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crimealert
JWT_SECRET=your_secret_key
```

## API Endpoints (Planned)

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Zones

- GET `/api/zones` - Get all user zones
- POST `/api/zones` - Create new zone
- PUT `/api/zones/:id` - Update zone
- DELETE `/api/zones/:id` - Delete zone

### Alerts

- GET `/api/alerts` - Get all alerts
- GET `/api/alerts/zone/:id` - Get alerts by zone
- POST `/api/alerts` - Create new alert
