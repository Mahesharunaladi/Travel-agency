#!/bin/bash
# CloudWatch Alarms Setup Script
# Configures monitoring and alerting for production environment

set -e

ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-us-east-1}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📊 Setting up CloudWatch Alarms for $ENVIRONMENT${NC}"

# Cluster and Service names
if [ "$ENVIRONMENT" = "production" ]; then
    CLUSTER="airline-booking-prod"
    BACKEND_SERVICE="airline-booking-backend-prod"
    FRONTEND_SERVICE="airline-booking-frontend-prod"
    SNS_TOPIC="arn:aws:sns:${AWS_REGION}:123456789012:airline-booking-alerts-prod"
else
    CLUSTER="airline-booking-staging"
    BACKEND_SERVICE="airline-booking-backend-staging"
    FRONTEND_SERVICE="airline-booking-frontend-staging"
    SNS_TOPIC="arn:aws:sns:${AWS_REGION}:123456789012:airline-booking-alerts-staging"
fi

# Function to create alarm
create_alarm() {
    local alarm_name=$1
    local metric_name=$2
    local threshold=$3
    local comparison=$4
    local statistic=$5
    local dimensions=$6
    
    echo -e "${YELLOW}Creating alarm: $alarm_name${NC}"
    
    aws cloudwatch put-metric-alarm \
        --alarm-name "$alarm_name" \
        --alarm-description "Alarm for $alarm_name" \
        --metric-name "$metric_name" \
        --namespace AWS/ECS \
        --statistic "$statistic" \
        --period 300 \
        --evaluation-periods 2 \
        --threshold "$threshold" \
        --comparison-operator "$comparison" \
        --alarm-actions "$SNS_TOPIC" \
        --dimensions $dimensions \
        --region "$AWS_REGION"
    
    echo -e "${GREEN}✅ Alarm created: $alarm_name${NC}"
}

# Create backend alarms
echo -e "${YELLOW}Creating Backend Service Alarms...${NC}"

create_alarm \
    "airline-booking-backend-high-cpu" \
    "CPUUtilization" \
    "80" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=ServiceName,Value=$BACKEND_SERVICE Name=ClusterName,Value=$CLUSTER"

create_alarm \
    "airline-booking-backend-high-memory" \
    "MemoryUtilization" \
    "85" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=ServiceName,Value=$BACKEND_SERVICE Name=ClusterName,Value=$CLUSTER"

create_alarm \
    "airline-booking-backend-task-failures" \
    "RunningCount" \
    "1" \
    "LessThanThreshold" \
    "Minimum" \
    "Name=ServiceName,Value=$BACKEND_SERVICE Name=ClusterName,Value=$CLUSTER"

# Create frontend alarms
echo -e "${YELLOW}Creating Frontend Service Alarms...${NC}"

create_alarm \
    "airline-booking-frontend-high-cpu" \
    "CPUUtilization" \
    "80" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=ServiceName,Value=$FRONTEND_SERVICE Name=ClusterName,Value=$CLUSTER"

create_alarm \
    "airline-booking-frontend-high-memory" \
    "MemoryUtilization" \
    "85" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=ServiceName,Value=$FRONTEND_SERVICE Name=ClusterName,Value=$CLUSTER"

# Create ALB alarms
echo -e "${YELLOW}Creating Application Load Balancer Alarms...${NC}"

create_alarm \
    "airline-booking-alb-high-response-time" \
    "TargetResponseTime" \
    "2" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=LoadBalancer,Value=app/airline-booking/1234567890abcdef"

create_alarm \
    "airline-booking-alb-high-error-rate" \
    "HTTPCode_Target_5XX_Count" \
    "5" \
    "GreaterThanThreshold" \
    "Sum" \
    "Name=LoadBalancer,Value=app/airline-booking/1234567890abcdef"

create_alarm \
    "airline-booking-alb-unhealthy-hosts" \
    "UnHealthyHostCount" \
    "0" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=LoadBalancer,Value=app/airline-booking/1234567890abcdef"

# Create RDS alarms
echo -e "${YELLOW}Creating RDS Database Alarms...${NC}"

create_alarm \
    "airline-booking-db-high-cpu" \
    "CPUUtilization" \
    "80" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=DBInstanceIdentifier,Value=airline-booking-${ENVIRONMENT}-db"

create_alarm \
    "airline-booking-db-low-storage" \
    "FreeStorageSpace" \
    "10737418240" \
    "LessThanThreshold" \
    "Average" \
    "Name=DBInstanceIdentifier,Value=airline-booking-${ENVIRONMENT}-db"

create_alarm \
    "airline-booking-db-high-connections" \
    "DatabaseConnections" \
    "80" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=DBInstanceIdentifier,Value=airline-booking-${ENVIRONMENT}-db"

# Create Redis/ElastiCache alarms
echo -e "${YELLOW}Creating ElastiCache Alarms...${NC}"

create_alarm \
    "airline-booking-redis-high-cpu" \
    "EngineCPUUtilization" \
    "80" \
    "GreaterThanThreshold" \
    "Average" \
    "Name=CacheClusterId,Value=airline-booking-${ENVIRONMENT}-cache"

create_alarm \
    "airline-booking-redis-evictions" \
    "Evictions" \
    "100" \
    "GreaterThanThreshold" \
    "Sum" \
    "Name=CacheClusterId,Value=airline-booking-${ENVIRONMENT}-cache"

echo -e "${GREEN}✅ All CloudWatch alarms created successfully${NC}"
