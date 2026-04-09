# GitHub Actions CI/CD Configuration
# Travel Agency Airline Booking System

## Deployment Environments

### Staging Environment
- URL: https://staging-api.airline-booking.dev
- Frontend: https://staging-web.airline-booking.dev
- Branch: develop, staging
- Auto-deploy: Yes on successful tests
- Database: PostgreSQL (RDS)
- Cache: Redis (ElastiCache)

### Production Environment
- URL: https://api.airline-booking.com
- Frontend: https://airline-booking.com
- Branch: main (tagged releases only)
- Auto-deploy: No (manual approval required)
- Database: PostgreSQL (RDS Multi-AZ)
- Cache: Redis (ElastiCache Multi-AZ)

## Required Secrets

### AWS Credentials
- AWS_ACCESS_KEY_ID_STAGING
- AWS_SECRET_ACCESS_KEY_STAGING
- AWS_ACCESS_KEY_ID_PROD
- AWS_SECRET_ACCESS_KEY_PROD
- AWS_ACCOUNT_ID
- AWS_REGION
- AWS_ROLE_TO_ASSUME

### Database
- DB_HOST_STAGING
- DB_USER_STAGING
- DB_NAME_STAGING
- DB_PASSWORD_STAGING
- DB_HOST_PROD
- DB_USER_PROD
- DB_NAME_PROD
- DB_PASSWORD_PROD
- DATABASE_URL_STAGING
- DATABASE_URL_PROD

### Third-party Services
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET
- AMADEUS_CLIENT_ID
- AMADEUS_CLIENT_SECRET
- SENDGRID_API_KEY
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

### Monitoring & Security
- SNYK_TOKEN
- SONAR_TOKEN
- GITGUARDIAN_API_KEY
- SENTRY_AUTH_TOKEN
- SLACK_WEBHOOK_URL
- SLACK_WEBHOOK_URL_STAGING
- SLACK_WEBHOOK_URL_PROD

### AWS Services
- AWS_BACKUP_BUCKET
- AWS_S3_BUCKET_STAGING
- AWS_S3_BUCKET_PROD

### Frontend Build
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_PAYMENT_KEY

### Test Users
- TEST_USER_EMAIL
- TEST_USER_PASSWORD

## Workflow Triggers

### 01-lint-and-test.yml
- **Trigger:** Push to main/develop, PR
- **Jobs:** Backend Lint, Backend Tests, Frontend Lint, Frontend Tests, Security Scan
- **Duration:** ~15-20 minutes
- **Failure Action:** Block merge

### 02-build-and-push.yml
- **Trigger:** Successful 01-lint-and-test, tags
- **Jobs:** Build Backend, Build Frontend, Scan Images
- **Duration:** ~10-15 minutes
- **Output:** Docker images in GHCR

### 03-deploy-staging.yml
- **Trigger:** Successful 02-build-and-push on develop/staging
- **Jobs:** Deploy Backend, Deploy Frontend, Smoke Tests
- **Duration:** ~10-15 minutes
- **Rollback:** Automatic on smoke test failure

### 04-deploy-production.yml
- **Trigger:** Manual or tag push v*
- **Jobs:** Pre-checks, Deploy, E2E Tests, Performance Tests
- **Duration:** ~30-40 minutes
- **Rollback:** Manual approval or automatic on test failure

### 05-database-migrations.yml
- **Trigger:** Manual or called from deployment
- **Jobs:** Validate, Backup, Migrate, Verify
- **Duration:** ~5-10 minutes
- **Safety:** Database backup before migration

### 06-performance-testing.yml
- **Trigger:** Daily 2 AM UTC or manual
- **Jobs:** Load, Stress, Soak, Spike tests
- **Duration:** ~1-2 hours for all tests
- **Report:** HTML report with charts

### 07-security-compliance.yml
- **Trigger:** Push to main/develop, daily scan
- **Jobs:** Dependencies, Containers, Secrets, SAST, CodeQL
- **Duration:** ~30-40 minutes
- **Report:** SARIF format for GitHub Security tab

### 08-monitoring-observability.yml
- **Trigger:** Every 5 minutes (health checks), daily analysis
- **Jobs:** Health checks, Uptime, Logs, Metrics, SLA
- **Duration:** ~5 minutes
- **Alerts:** Slack notifications for critical issues

## CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Push/PR                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │  01: Lint & Test       │
                │  - Backend Lint        │
                │  - Backend Tests       │
                │  - Frontend Lint       │
                │  - Frontend Tests      │
                │  - Security Scan       │
                └────────────┬───────────┘
                             │
                ┌────────────▼────────────────┐
                │  02: Build & Push          │
                │  - Build Backend Image     │
                │  - Build Frontend Image    │
                │  - Scan Docker Images      │
                │  - Sign Images (prod only) │
                └────┬───────────────────┬───┘
                     │                   │
         ┌───────────▼─────────┐  ┌──────▼────────────────┐
         │  03: Deploy Staging  │  │  04: Deploy Production │
         │  - ECS Deployment    │  │  - ECS Deployment      │
         │  - DB Migrations     │  │  - DB Migrations       │
         │  - Smoke Tests       │  │  - E2E Tests           │
         │  - Auto-rollback     │  │  - Performance Tests   │
         └─────────────────────┘  │  - Manual Approval     │
                                  │  - Auto-rollback       │
                                  └────────────────────────┘
                
          Parallel Workflows:
          
   ┌──────────────────────────┐
   │  06: Performance Testing  │
   │  - Load Tests             │
   │  - Stress Tests           │
   │  - Soak Tests             │
   │  - Spike Tests            │
   └──────────────────────────┘
   
   ┌──────────────────────────┐
   │  07: Security Scanning    │
   │  - Dependency Check       │
   │  - Container Scan         │
   │  - Secret Scanning        │
   │  - SAST                   │
   │  - CodeQL                 │
   └──────────────────────────┘
   
   ┌──────────────────────────┐
   │  08: Monitoring           │
   │  - Health Checks          │
   │  - Uptime Verification    │
   │  - Log Analysis           │
   │  - SLA Compliance         │
   └──────────────────────────┘
```

## Best Practices

### Code Quality
- Maintain >80% code coverage
- ESLint strict mode for all code
- Prettier formatting enforced
- TypeScript strict mode enabled

### Security
- All secrets stored in GitHub Secrets
- No hardcoded credentials in code
- Container images signed for production
- SBOM (Software Bill of Materials) generated
- Regular dependency updates

### Performance
- Database migrations tested before production
- Load testing before major releases
- Cache strategies implemented
- CDN for static assets

### Reliability
- Database backups before migrations
- Automatic rollback on failure
- Health checks after deployment
- SLA monitoring active

### Documentation
- README updated with deployment steps
- Architecture decisions documented
- Runbook for common incidents
- Test results archived for 30 days

## Running Workflows Locally

### Lint and Test
```bash
npm run lint
npm run test:unit
npm run test:integration
```

### Build
```bash
docker build -t airline-booking-backend:latest ./backend
docker build -t airline-booking-frontend:latest ./frontend
```

### Deploy
```bash
# Deploy staging
./infrastructure/scripts/deploy.sh staging

# Deploy production (requires approval)
./infrastructure/scripts/deploy.sh production
```

## Troubleshooting

### Workflow Fails at Linting
- Run `npm run lint:fix` to auto-fix issues
- Check Node.js version matches .nvmrc

### Docker Build Fails
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Check build args are passed correctly

### Database Migration Fails
- Verify database connection
- Check migration file syntax
- Review migration rollback plan

### Deployment Fails
- Check AWS credentials in GitHub Secrets
- Verify ECS cluster and service exist
- Review CloudWatch logs for errors

## Contact & Support

For issues or questions:
1. Check GitHub Issues
2. Review workflow logs
3. Contact DevOps team
4. Create incident ticket
