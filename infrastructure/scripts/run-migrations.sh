#!/bin/bash
# Database Migration Script
# Handles database migrations for different environments

set -e

ENVIRONMENT=${1:-staging}
MIGRATION_NAME=${2:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗄️  Database Migration Script${NC}"
echo "Environment: $ENVIRONMENT"

# Source environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    source ".env.$ENVIRONMENT"
else
    echo -e "${RED}❌ Environment file not found: .env.$ENVIRONMENT${NC}"
    exit 1
fi

# Function to create backup
create_backup() {
    echo -e "${YELLOW}💾 Creating database backup...${NC}"
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_${ENVIRONMENT}_${TIMESTAMP}.sql.gz"
    
    if command -v pg_dump &> /dev/null; then
        pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
        echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  pg_dump not found, skipping backup${NC}"
    fi
}

# Function to validate migrations
validate_migrations() {
    echo -e "${YELLOW}✅ Validating migrations...${NC}"
    cd backend
    npm run typeorm -- migration:show
    cd ..
}

# Function to run migrations
run_migrations() {
    echo -e "${YELLOW}🚀 Running migrations...${NC}"
    cd backend
    
    if [ -z "$MIGRATION_NAME" ]; then
        echo -e "${YELLOW}Running all pending migrations...${NC}"
        npm run typeorm -- migration:run
    else
        echo -e "${YELLOW}Running migration: $MIGRATION_NAME${NC}"
        npm run typeorm -- migration:run -m "$MIGRATION_NAME"
    fi
    
    cd ..
    echo -e "${GREEN}✅ Migrations completed${NC}"
}

# Function to verify migration
verify_migration() {
    echo -e "${YELLOW}🔍 Verifying migrations...${NC}"
    cd backend
    npm run typeorm -- migration:show
    cd ..
}

# Function to rollback migration
rollback_migration() {
    echo -e "${YELLOW}⏮️  Rolling back last migration...${NC}"
    cd backend
    npm run typeorm -- migration:revert
    cd ..
}

# Main execution
case "${3:-migrate}" in
    migrate)
        validate_migrations
        create_backup
        run_migrations
        verify_migration
        echo -e "${GREEN}✅ Migration completed successfully${NC}"
        ;;
    rollback)
        create_backup
        rollback_migration
        echo -e "${GREEN}✅ Rollback completed successfully${NC}"
        ;;
    validate)
        validate_migrations
        ;;
    verify)
        verify_migration
        ;;
    *)
        echo -e "${RED}❌ Unknown command: ${3}${NC}"
        echo "Usage: $0 <environment> [migration_name] [command]"
        echo "Commands: migrate (default), rollback, validate, verify"
        exit 1
        ;;
esac
