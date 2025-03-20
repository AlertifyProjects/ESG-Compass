# ESG-Compass API

## Setup and Installation

1. Install dependencies:
cd server
npm install mongoose express bcryptjs jsonwebtoken dotenv cors helmet morgan express-rate-limit joi
npm install --save-dev nodemon

2. Create a `.env` file with the following variables: ..\server\.env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/esgcompass
JWT_SECRET=your_jwt_secret_here

3. Seed the database: npm run seed

4. Start the server: npm run dev

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Users
- `POST /api/users` - Create new user (Admin)
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Organizations
- `POST /api/organizations` - Create new organization (Admin)
- `GET /api/organizations` - Get all organizations (Admin)
- `GET /api/organizations/:id` - Get organization by ID
- `PUT /api/organizations/:id` - Update organization (Admin)
- `DELETE /api/organizations/:id` - Delete organization (Admin)

### Metrics
- `POST /api/metrics` - Create new metric
- `GET /api/metrics` - Get all metrics
- `GET /api/metrics/:id` - Get metric by ID
- `PUT /api/metrics/:id` - Update metric
- `DELETE /api/metrics/:id` - Delete metric
- `GET /api/metrics/framework/:framework` - Get metrics by framework

### Metric Data
- `POST /api/metric-data` - Create new metric data
- `GET /api/metric-data` - Get all metric data
- `GET /api/metric-data/:id` - Get metric data by ID
- `PUT /api/metric-data/:id` - Update metric data
- `DELETE /api/metric-data/:id` - Delete metric data
- `PUT /api/metric-data/:id/verify` - Verify metric data

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/export` - Add report export to history
- `GET /api/reports/:id/data` - Get report data with metric values