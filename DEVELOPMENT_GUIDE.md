# Airline Booking System - Complete Development & CI/CD Guide

## 📋 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+
- Git

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/Travel-agency.git
cd Travel-agency

# Start services with Docker Compose
docker-compose up -d

# Backend setup
cd backend
mvn clean install
mvn spring-boot:run

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture Overview

### Microservices
- **Auth Service**: JWT-based authentication with refresh tokens
- **User Service**: User management and profile
- **Flight Service**: Flight search and availability
- **Booking Service**: Booking management with double-booking prevention
- **Payment Service**: Razorpay/Stripe integration
- **Benefits Service**: Tier management and loyalty points
- **Support Service**: Customer support tickets
- **Notification Service**: Email/SMS notifications

### Technology Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **API Documentation**: Swagger/OpenAPI 3.0
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## 🔐 Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Rate limiting on sensitive endpoints

### Data Protection
- PostgreSQL with encrypted connections
- Redis with optional password protection
- Bcrypt password hashing (cost factor 12)
- CORS configuration

### Payment Security
- PCI-DSS Level 1 compliant (hosted payment pages)
- Webhook signature verification
- Idempotency keys
- Server-side amount verification

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profile
- `tiers` - Subscription tiers (Standard, Plus, Premium)
- `airlines` - Airline information
- `airports` - Airport data
- `flights` - Flight inventory
- `seat_inventory` - Seat availability and status
- `bookings` - Booking records
- `passengers` - Passenger details
- `payments` - Payment transactions
- `support_tickets` - Customer support

### Indexes
- `idx_email` on users.email
- `idx_tier` on users.tier
- `idx_flights_route_date` on flights
- `idx_bookings_user` on bookings.user_id

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Lint & Test (`01-lint-and-test.yml`)
- **Backend**: Maven build, unit tests, code coverage
- **Frontend**: ESLint, TypeScript check, Jest tests
- Trigger: Push to main/develop/staging, Pull requests

#### 2. Build Docker Images (`02-build-docker.yml`)
- Build backend JAR and Docker image
- Build frontend and Docker image
- Security scanning with Trivy
- Registry: GitHub Container Registry (ghcr.io)

#### 3. Deploy (`03-deploy.yml`)
- Staging deployment on develop branch
- Production deployment on main branch
- ECS service updates
- Health checks post-deployment
- Slack notifications

#### 4. Code Quality (`04-quality-security.yml`)
- SonarQube analysis
- OWASP Dependency Check
- SpotBugs (Java) & ESLint (JavaScript)
- License compliance check

#### 5. Documentation & Release (`05-docs-release.yml`)
- Generate API documentation
- Deploy to GitHub Pages
- Create GitHub releases
- Publish artifacts

## 📦 Deployment

### Environment Variables

**.env.production**
```bash
# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=airline_booking_prod
DB_USER=postgres
DB_PASSWORD=<secure-password>

# Cache
REDIS_HOST=prod-cache.example.com
REDIS_PORT=6379

# JWT
JWT_SECRET=<strong-secret-key>

# Payment
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>

# Frontend
NEXT_PUBLIC_API_URL=https://api.airlinebooking.com/api/v1
```

### AWS Deployment

```bash
# Configure AWS CLI
aws configure

# Deploy stack
aws ecs create-cluster --cluster-name airline-booking-production

# Update services
aws ecs update-service \
  --cluster airline-booking-production \
  --service backend-service \
  --force-new-deployment
```

## 🔍 Monitoring & Observability

### Prometheus Metrics
```
# Application
http_requests_total
http_requests_duration_seconds
http_request_size_bytes
http_response_size_bytes

# Business
bookings_created_total
payment_success_rate
user_registrations_total
```

### Grafana Dashboards
- Request rates and latencies
- Error rates by endpoint
- Database connection pool
- Redis memory usage
- Business KPIs

### Kibana (Log Analysis)
- Centralized logging for all services
- Log aggregation and search
- Alert creation
- Dashboard creation

## 🧪 Testing Strategy

### Backend Testing
```bash
# Unit tests
mvn test

# Integration tests
mvn verify

# Code coverage
mvn jacoco:report
```

### Frontend Testing
```bash
# Unit tests
npm test

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📚 API Documentation

### Accessing Swagger UI
```
http://localhost:3001/swagger-ui.html
http://localhost:3001/v3/api-docs
```

### Key Endpoints

**Authentication**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
```

**Users**
```
GET    /users/me
GET    /users/{id}
PUT    /users/me
```

**Flights**
```
GET    /flights/search
GET    /flights/{id}
```

**Bookings**
```
POST   /bookings
GET    /bookings/{id}
PATCH  /bookings/{id}/cancel
```

## 🔄 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature
```

### 2. Make Changes
```bash
# Backend
cd backend
# Make code changes
mvn test
git add .
git commit -m "feat: description"

# Frontend
cd frontend
# Make code changes
npm test
git add .
git commit -m "feat: description"
```

### 3. Push and Create PR
```bash
git push origin feature/your-feature
# Create PR on GitHub
```

### 4. CI/CD Runs
- Lint & tests run automatically
- Code quality analysis
- Security scanning
- Coverage reports

### 5. Merge & Deploy
```bash
# After review and approval
# Merge to develop for staging deployment
# Merge to main for production deployment
```

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check logs
docker logs airline-booking-backend

# Verify database connection
docker exec -it airline-booking-db psql -U postgres -c "SELECT 1"

# Check migrations
mvn flyway:info
```

### Frontend Build Issues
```bash
# Clear cache
rm -rf .next node_modules
npm cache clean --force
npm install
npm run build
```

### Database Issues
```bash
# Reset database
docker exec -it airline-booking-db psql -U postgres -c "DROP DATABASE airline_booking;"
docker exec -it airline-booking-db psql -U postgres -c "CREATE DATABASE airline_booking;"
```

## 📈 Performance Optimization

### Backend
- Connection pooling (HikariCP)
- Query optimization with indexes
- Caching layer (Redis)
- Async processing for notifications

### Frontend
- Next.js SSR/SSG
- Image optimization
- Code splitting
- Lazy loading components

## 🔐 Security Checklist

- [ ] JWT secrets properly configured
- [ ] Database credentials not in code
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] Rate limiting enabled
- [ ] Logging of security events
- [ ] Regular dependency updates
- [ ] Secrets rotation schedule

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/Travel-agency/issues
- Email: support@airlinebooking.com
- Slack: #airline-booking

## 📄 License

Apache 2.0

## 🙏 Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
