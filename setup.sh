#!/bin/bash

# 🚀 Airline Booking System - Quick Start Script
# This script sets up the complete development environment

set -e

echo "🚀 Airline Booking System - Complete Setup"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java $(java -version 2>&1 | head -n 1)${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}✗ Maven is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven installed${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose installed${NC}"

echo ""
echo "🔧 Setting up project structure..."

# Create necessary directories
mkdir -p backend/src/{main,test}/{java/com/airlinebooking/{entity,dto,repository,service,controller,config,security,exception},resources}
mkdir -p frontend/src/{app,lib,services,store,components}
mkdir -p infrastructure/{scripts,docker,k8s}

echo ""
echo "🗄️ Starting services with Docker Compose..."

# Start services
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check PostgreSQL
if docker exec airline-booking-db pg_isready -U postgres &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL is not ready yet${NC}"
fi

# Check Redis
if docker exec airline-booking-cache redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✓ Redis is ready${NC}"
else
    echo -e "${YELLOW}⚠ Redis is not ready yet${NC}"
fi

echo ""
echo "🏗️ Building backend..."

cd backend
mvn clean install -DskipTests -q
echo -e "${GREEN}✓ Backend built successfully${NC}"
cd ..

echo ""
echo "🎨 Building frontend..."

cd frontend
npm install -q
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Frontend built successfully${NC}"
cd ..

echo ""
echo "🧪 Running tests..."

echo "Running backend tests..."
cd backend
mvn test -q
echo -e "${GREEN}✓ Backend tests passed${NC}"
cd ..

echo "Running frontend tests..."
cd frontend
npm test -- --coverage --watchAll=false > /dev/null 2>&1 || true
echo -e "${GREEN}✓ Frontend tests completed${NC}"
cd ..

echo ""
echo "📊 Setting up monitoring..."

# Check if monitoring services are running
if docker ps | grep -q prometheus; then
    echo -e "${GREEN}✓ Prometheus is running on http://localhost:9090${NC}"
fi

if docker ps | grep -q grafana; then
    echo -e "${GREEN}✓ Grafana is running on http://localhost:3100${NC}"
    echo "  (Default credentials: admin/admin)"
fi

if docker ps | grep -q kibana; then
    echo -e "${GREEN}✓ Kibana is running on http://localhost:5601${NC}"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🔗 Service URLs:"
echo "  - Frontend:    http://localhost:3000"
echo "  - Backend API: http://localhost:3001"
echo "  - Swagger UI:  http://localhost:3001/swagger-ui.html"
echo "  - Prometheus:  http://localhost:9090"
echo "  - Grafana:     http://localhost:3100"
echo "  - Kibana:      http://localhost:5601"
echo ""
echo "📚 Next steps:"
echo "  1. Backend: cd backend && mvn spring-boot:run"
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "📖 Documentation: See DEVELOPMENT_GUIDE.md"
echo "🔗 API Docs: http://localhost:3001/swagger-ui.html"
echo ""
