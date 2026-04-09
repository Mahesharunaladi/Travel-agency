#!/bin/bash
# Deployment Script for Airline Booking System
# Deploys to AWS ECS

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deployment Script - Environment: $ENVIRONMENT${NC}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Load environment configuration
if [ -f ".env.$ENVIRONMENT" ]; then
    source ".env.$ENVIRONMENT"
else
    echo -e "${RED}❌ Environment file not found: .env.$ENVIRONMENT${NC}"
    exit 1
fi

# AWS Configuration
AWS_REGION="us-east-1"
if [ "$ENVIRONMENT" = "production" ]; then
    CLUSTER_NAME="airline-booking-prod"
    BACKEND_SERVICE="airline-booking-backend-prod"
    FRONTEND_SERVICE="airline-booking-frontend-prod"
else
    CLUSTER_NAME="airline-booking-staging"
    BACKEND_SERVICE="airline-booking-backend-staging"
    FRONTEND_SERVICE="airline-booking-frontend-staging"
fi

# Function to get current task definition
get_task_definition() {
    local service=$1
    aws ecs describe-services \
        --cluster "$CLUSTER_NAME" \
        --services "$service" \
        --region "$AWS_REGION" \
        --query 'services[0].taskDefinition' \
        --output text
}

# Function to update service
update_service() {
    local service=$1
    local task_def=$2
    
    echo -e "${YELLOW}Updating service: $service${NC}"
    aws ecs update-service \
        --cluster "$CLUSTER_NAME" \
        --service "$service" \
        --task-definition "$task_def" \
        --force-new-deployment \
        --region "$AWS_REGION"
    
    echo -e "${GREEN}✅ Service update initiated${NC}"
}

# Function to wait for deployment
wait_for_deployment() {
    local service=$1
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        DEPLOYMENT_COUNT=$(aws ecs describe-services \
            --cluster "$CLUSTER_NAME" \
            --services "$service" \
            --region "$AWS_REGION" \
            --query 'services[0].deployments | length(@)' \
            --output text)
        
        if [ "$DEPLOYMENT_COUNT" -eq 1 ]; then
            echo -e "${GREEN}✅ Deployment completed${NC}"
            return 0
        fi
        
        echo "Attempt $((attempt + 1))/$max_attempts: Deployments still in progress ($DEPLOYMENT_COUNT)..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Deployment timeout${NC}"
    return 1
}

# Function to verify deployment
verify_deployment() {
    local service=$1
    
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
    
    RUNNING_COUNT=$(aws ecs describe-services \
        --cluster "$CLUSTER_NAME" \
        --services "$service" \
        --region "$AWS_REGION" \
        --query 'services[0].runningCount' \
        --output text)
    
    DESIRED_COUNT=$(aws ecs describe-services \
        --cluster "$CLUSTER_NAME" \
        --services "$service" \
        --region "$AWS_REGION" \
        --query 'services[0].desiredCount' \
        --output text)
    
    if [ "$RUNNING_COUNT" -eq "$DESIRED_COUNT" ]; then
        echo -e "${GREEN}✅ Service healthy: $RUNNING_COUNT/$DESIRED_COUNT tasks running${NC}"
        return 0
    else
        echo -e "${RED}❌ Service unhealthy: $RUNNING_COUNT/$DESIRED_COUNT tasks running${NC}"
        return 1
    fi
}

# Function to perform health check
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}❤️  Performing health check on $url${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            return 0
        fi
        
        echo "Attempt $((attempt + 1))/$max_attempts: Health check failed (HTTP $HTTP_CODE)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Health check timeout${NC}"
    return 1
}

# Main deployment flow
echo -e "${BLUE}Starting deployment to $ENVIRONMENT...${NC}\n"

# Step 1: Backup current configuration
echo -e "${YELLOW}📋 Backing up current configuration...${NC}"
aws ecs describe-services \
    --cluster "$CLUSTER_NAME" \
    --services "$BACKEND_SERVICE" "$FRONTEND_SERVICE" \
    --region "$AWS_REGION" > ".backup_${ENVIRONMENT}_$(date +%Y%m%d_%H%M%S).json"
echo -e "${GREEN}✅ Configuration backed up${NC}\n"

# Step 2: Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
./infrastructure/scripts/run-migrations.sh "$ENVIRONMENT" "" "migrate" || {
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Database migrations completed${NC}\n"

# Step 3: Deploy backend
echo -e "${YELLOW}🐳 Deploying backend service...${NC}"
BACKEND_TASK=$(get_task_definition "$BACKEND_SERVICE")
update_service "$BACKEND_SERVICE" "$BACKEND_TASK"
wait_for_deployment "$BACKEND_SERVICE" || exit 1
verify_deployment "$BACKEND_SERVICE" || exit 1
echo -e "${GREEN}✅ Backend deployment verified${NC}\n"

# Step 4: Deploy frontend
echo -e "${YELLOW}🐳 Deploying frontend service...${NC}"
FRONTEND_TASK=$(get_task_definition "$FRONTEND_SERVICE")
update_service "$FRONTEND_SERVICE" "$FRONTEND_TASK"
wait_for_deployment "$FRONTEND_SERVICE" || exit 1
verify_deployment "$FRONTEND_SERVICE" || exit 1
echo -e "${GREEN}✅ Frontend deployment verified${NC}\n"

# Step 5: Health checks
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Performing post-deployment health checks...${NC}"
    health_check "https://api.airline-booking.com/health" || exit 1
    health_check "https://airline-booking.com/" || exit 1
else
    echo -e "${YELLOW}Performing post-deployment health checks...${NC}"
    health_check "https://staging-api.airline-booking.dev/health" || exit 1
    health_check "https://staging-web.airline-booking.dev/" || exit 1
fi
echo -e "${GREEN}✅ All health checks passed${NC}\n"

# Step 6: Deployment summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Environment:${NC} $ENVIRONMENT"
echo -e "${YELLOW}Timestamp:${NC} $(date)"
echo -e "${YELLOW}Backend Service:${NC} $BACKEND_SERVICE"
echo -e "${YELLOW}Frontend Service:${NC} $FRONTEND_SERVICE"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
