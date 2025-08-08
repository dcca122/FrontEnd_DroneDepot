# DroneDepot Backend API

A Fastify-based backend API for DroneDepot with public v1 endpoints for front-end consumption.

## Features

- **Public API v1** - Stable endpoints for front-end consumption
- **CORS Support** - Configurable allowed origins
- **Rate Limiting** - IP-based rate limiting for public endpoints
- **Job Request System** - Lead intake with email notifications
- **OpenAPI Documentation** - Swagger UI for API exploration
- **Comprehensive Testing** - Vitest-based test suite
- **Prisma ORM** - Type-safe database operations

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database and email settings
   ```

3. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3001`

## Public API v1

### Base URL
- Development: `http://localhost:3001`
- Production: `https://api.drone-depot.ai`

### Endpoints

#### `GET /v1/public/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "time": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /v1/public/plans`
Returns subscription plans and credit details.

**Response:**
```json
[
  {
    "id": "starter",
    "name": "Starter",
    "priceMonthly": 199,
    "creditsPerMonth": 1,
    "rollover": true,
    "features": [
      "FAA-certified pilots",
      "48-hour delivery",
      "Priority scheduling"
    ],
    "notes": "1 credit ≈ photo-only standard shoot"
  }
]
```

#### `GET /v1/public/sections`
Returns video reel configuration for homepage.

**Response:**
```json
[
  {
    "id": "hero",
    "headline": "Sell Faster. Show More.",
    "subcopy": "Aerials that make listings pop.",
    "poster": "https://cdn.drone-depot.ai/hero-poster.jpg",
    "sources": [
      {"src": "https://cdn.drone-depot.ai/hero.mp4", "type": "video/mp4"},
      {"src": "https://cdn.drone-depot.ai/hero.webm", "type": "video/webm"}
    ],
    "cta": {"label": "Request a Job", "href": "/request"}
  }
]
```

#### `POST /v1/public/job-request`
Submit a new job request for aerial photography services.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Real Estate",
  "industry": "real_estate",
  "location": {
    "addressLine1": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "postalCode": "78701",
    "lat": 30.2672,
    "lng": -97.7431
  },
  "dateWindow": {
    "start": "2024-02-01",
    "end": "2024-02-15"
  },
  "budgetBand": "1000_2500",
  "mustHaveShots": "Aerial view of the entire property",
  "referral": "Google Search",
  "agreeToTerms": true
}
```

**Response:**
```json
{
  "ok": true,
  "jobNumber": "DD-250808-0123"
}
```

### CORS Configuration

The API supports CORS for the following domains:
- `http://localhost:3000` (development)
- `https://front-end-drone-depot.vercel.app` (staging)
- `https://drone-depot.ai` (production)

To add new domains, update the `CORS_ALLOWED_ORIGINS` environment variable:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Rate Limiting

- **General endpoints**: 60 requests per 5 minutes per IP
- **Job requests**: 10 requests per 10 minutes per IP
- **Localhost**: Exempt from rate limiting

### Validation

All endpoints use Zod schemas for request validation. Invalid requests return:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email",
      "path": ["email"]
    }
  ]
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,https://front-end-drone-depot.vercel.app,https://drone-depot.ai` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `300000` (5 minutes) |
| `RATE_LIMIT_MAX` | Maximum requests per window | `60` |
| `EMAIL_FROM` | From email address | `noreply@drone-depot.ai` |
| `ADMIN_NOTIFY_EMAIL` | Admin notification email | `ops@drone-depot.ai` |
| `HCAPTCHA_SECRET` | hCaptcha secret key | Optional |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |

## Development

### Running Tests
```bash
npm test
npm run test:watch
```

### Database Commands
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

### API Documentation

When running in development mode, Swagger UI is available at:
- `http://localhost:3001/docs`

### Postman Collection

A Postman collection is available at:
- `docs/POSTMAN_COLLECTION.json`

## Project Structure

```
├── src/
│   ├── schemas/          # Zod validation schemas
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── config/
│   ├── plans.ts         # Subscription plans configuration
│   └── sections.json    # Video sections configuration
├── prisma/
│   └── schema.prisma    # Database schema
├── tests/
│   └── api.test.js      # API tests
├── docs/
│   └── POSTMAN_COLLECTION.json
├── openapi.yml          # OpenAPI specification
└── README.md
```

## Deployment

### Production Setup

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure production database URL
   - Set up email credentials
   - Configure CORS origins

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run db:generate
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
