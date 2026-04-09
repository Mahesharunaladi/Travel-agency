# Quick Reference - Airline Booking System

## 🚀 Start Services

```bash
# Full stack with Docker Compose
docker-compose up -d

# Verify all services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛑 Stop Services

```bash
docker-compose down
docker-compose down -v  # Remove volumes
```

## 📦 Build & Run Backend

```bash
cd backend

# Build JAR
mvn clean package -DskipTests

# Run locally
mvn spring-boot:run

# Run tests
mvn test

# Run specific test
mvn test -Dtest=AuthServiceTest
```

## 🎨 Build & Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🧪 Testing

```bash
# Backend tests with coverage
cd backend
mvn test jacoco:report
open target/site/jacoco/index.html

# Frontend tests with coverage
cd frontend
npm run test:cov
open coverage/lcov-report/index.html
```

## 📊 Access Services

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:3001 | 3001 |
| Swagger UI | http://localhost:3001/swagger-ui.html | 3001 |
| Prometheus | http://localhost:9090 | 9090 |
| Grafana | http://localhost:3100 | 3100 |
| Kibana | http://localhost:5601 | 5601 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |

## 🔐 Credentials

| Service | Username | Password |
|---------|----------|----------|
| Grafana | admin | admin |
| PostgreSQL | postgres | postgres |
| Redis | - | - |

## 🐛 Debugging

```bash
# View backend logs
tail -f backend/logs/application.log

# View Docker logs
docker logs -f airline-booking-backend

# Check database
docker exec -it airline-booking-db psql -U postgres -d airline_booking

# Check Redis
docker exec -it airline-booking-cache redis-cli
  > KEYS *
  > GET key-name

# Test API
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

## 🔄 Database Management

```bash
# Run migrations
cd backend
mvn flyway:migrate

# Reset database
docker exec -it airline-booking-db psql -U postgres -c "DROP DATABASE airline_booking;"
docker exec -it airline-booking-db psql -U postgres -c "CREATE DATABASE airline_booking;"

# Backup database
docker exec airline-booking-db pg_dump -U postgres airline_booking > backup.sql

# Restore database
docker exec -i airline-booking-db psql -U postgres airline_booking < backup.sql
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/xyz

# Make changes
git add .
git commit -m "feat: description"

# Push
git push origin feature/xyz

# Create Pull Request
# Wait for CI/CD to pass
# Merge to develop for staging
# Merge to main for production
```

## 🔖 Release Process

```bash
# Create release
git checkout main
git pull origin main
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automatically:
# 1. Builds release
# 2. Runs tests
# 3. Creates GitHub Release
# 4. Deploys to production
```

## 📋 Common Commands

```bash
# Install dependencies
cd backend && mvn install
cd frontend && npm install

# Format code
cd backend && mvn spotless:apply
cd frontend && npm run format

# Lint code
cd backend && mvn checkstyle:check
cd frontend && npm run lint

# Build docker images
docker-compose build

# Push to registry
docker push ghcr.io/yourusername/airline-booking-backend:latest
```

## 🚨 Troubleshooting

### Services won't start
```bash
# Check Docker daemon
docker ps

# Check ports in use
lsof -i :3000
lsof -i :3001

# Reset Docker
docker-compose down -v
docker-compose up -d
```

### Database connection error
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec -it airline-booking-db psql -U postgres -c "SELECT 1"

# View logs
docker logs airline-booking-db
```

### Frontend build error
```bash
# Clear cache
rm -rf .next node_modules
npm cache clean --force
npm install
npm run build
```

### Maven issues
```bash
# Clear cache
rm -rf ~/.m2/repository
cd backend
mvn clean install

# Update dependencies
mvn dependency:resolve
```

## 📊 Performance Monitoring

```bash
# View Prometheus metrics
curl http://localhost:9090/api/v1/query?query=http_requests_total

# Check Grafana dashboards
http://localhost:3100

# View application logs
http://localhost:5601 (Kibana)
```

## 🔄 CI/CD

```bash
# View workflow status
https://github.com/yourusername/Travel-agency/actions

# Trigger workflow manually
gh workflow run 01-lint-and-test.yml

# View workflow logs
gh run view --log
```

## 📚 Documentation

- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [CI/CD Setup](./CI-CD-SETUP-GUIDE.md)
- [API Documentation](http://localhost:3001/swagger-ui.html)
- [Project Summary](./PROJECT_SUMMARY.md)

## 💡 Tips & Tricks

```bash
# One-liner: Full setup
chmod +x setup.sh && ./setup.sh

# Monitor all services
docker-compose up -d && watch docker ps

# Real-time log tail
docker-compose logs -f

# Health check
curl -s http://localhost:3001/health | jq .

# Generate test data
# (See backend/src/test/java for test fixtures)
```

## ⚡ Performance Tips

1. **Backend**
   - Use database indexes
   - Enable query caching
   - Connection pooling

2. **Frontend**
   - Enable Next.js ISR
   - Image optimization
   - CSS-in-JS minification

3. **Database**
   - Regular ANALYZE
   - Vacuum optimization
   - Index maintenance

## 🔐 Security Tips

1. Never commit secrets
2. Use GitHub Secrets
3. Rotate tokens regularly
4. Update dependencies
5. Enable 2FA on GitHub
6. Use HTTPS in production

## 📞 Getting Help

1. Check logs: `docker-compose logs`
2. Review documentation
3. GitHub Issues
4. Slack community

---

**Last Updated**: April 9, 2026
**Version**: 1.0.0
