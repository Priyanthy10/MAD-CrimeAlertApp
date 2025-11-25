# Crime Alert Admin Panel

Admin dashboard for managing the Crime Alert system.

## TODO: Setup

This admin panel is not yet implemented. To get started:

1. Choose your framework:

   - React Admin
   - Next.js + Admin UI
   - Vue.js + Admin Template

2. Install dependencies:

```bash
npx create-react-app admin
# or
npx create-next-app@latest admin
```

## Planned Features

- Dashboard with statistics

  - Total users
  - Active zones
  - Recent alerts
  - Alert severity breakdown

- User Management

  - View all users
  - Ban/unban users
  - View user activity

- Zone Management

  - View all zones
  - Approve/reject zones
  - Delete inappropriate zones

- Alert Management

  - View all alerts
  - Verify/flag alerts
  - Remove false alerts
  - Alert categories and trends

- Settings
  - System configuration
  - Email templates
  - Notification settings

## Tech Stack (Suggested)

- **Frontend**: React / Next.js
- **UI Library**: Material-UI or Ant Design
- **Charts**: Recharts or Chart.js
- **State Management**: React Context or Redux
- **API Client**: Axios

## Authentication

Admin panel should use separate authentication from the mobile app with higher security requirements.
