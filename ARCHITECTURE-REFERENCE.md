# 🏗️ CI/CD Architecture & Infrastructure Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GitHub Repository                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Workflows (.github/workflows)                  │   │
│  │                                                                     │   │
│  │  01-lint-and-test.yml          ├─ Backend: Lint, Tests, Build     │   │
│  │  02-build-and-push.yml         ├─ Frontend: Lint, Tests, Build    │   │
│  │  03-deploy-staging.yml         ├─ Security: Scan, Verify          │   │
│  │  04-deploy-production.yml      ├─ Coverage: Report upload         │   │
│  │  05-database-migrations.yml    └─ Summary: Results compilation    │   │
│  │  06-performance-testing.yml                                        │   │
│  │  07-security-compliance.yml    Secrets: All stored encrypted      │   │
│  │  08-monitoring-observability   Branch Protection: Enabled          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
         │                          │                          │
         ▼                          ▼                          ▼
    ┌─────────────┐            ┌────────────┐          ┌─────────────┐
    │  GHCR.io    │            │   AWS      │          │   Slack     │
    │ Container   │            │ ECS/RDS    │          │  Webhook    │
    │  Registry   │            │ S3/SNS     │          │ Notifications
    └─────────────┘            └────────────┘          └─────────────┘
```

## Workflow Execution Flow

### 1. Code Push / Pull Request

```
Developer Push
     │
     ├─► GitHub Webhook
     │
     ├─► 01-Lint-and-Test
     │   ├─► Backend Lint (Node 18, 20)
     │   ├─► Backend Tests + Coverage
     │   ├─► Frontend Lint
     │   ├─► Frontend Tests + Coverage
     │   ├─► Security Scan (Snyk)
     │   └─► Summary & Status Check
     │
     └─► Branch Protection (Require Passing Checks)
```

### 2. Successful Tests & Build

```
Tests Passed
     │
     ├─► 02-Build-and-Push
     │   ├─► Backend Docker Build
     │   │   ├─► Multi-stage build
     │   │   ├─► Push to GHCR.io
     │   │   ├─► Generate SBOM
     │   │   └─► Output: backend:sha-develop
     │   │
     │   ├─► Frontend Docker Build
     │   │   ├─► Multi-stage build
     │   │   ├─► Build args injection
     │   │   ├─► Push to GHCR.io
     │   │   └─► Output: frontend:sha-develop
     │   │
     │   ├─► Image Scanning
     │   │   ├─► Trivy scan (CRITICAL,HIGH)
     │   │   └─► Grype scan
     │   │
     │   └─► Sign Images (prod tags only)
     │
     └─► Images Ready in Registry
```

### 3. Staging Deployment

```
Develop/Staging Branch Push
     │
     ├─► 03-Deploy-Staging
     │   ├─► Update ECS Task Definitions
     │   │   ├─► Inject new image tags
     │   │   └─► Update environment variables
     │   │
     │   ├─► Deploy Backend Service
     │   │   ├─► ECS update-service
     │   │   ├─► Wait for stability (15 min timeout)
     │   │   └─► Verify running count
     │   │
     │   ├─► Deploy Frontend Service
     │   │   ├─► ECS update-service
     │   │   ├─► Wait for stability
     │   │   └─► Verify running count
     │   │
     │   ├─► Run Database Migrations
     │   │   ├─► Backup current database
     │   │   ├─► TypeORM migration:run
     │   │   └─► Verify schema
     │   │
     │   ├─► Health Checks
     │   │   ├─► Backend: /health endpoint (retry 30x)
     │   │   └─► Frontend: Homepage (retry 30x)
     │   │
     │   ├─► Smoke Tests
     │   │   ├─► Login flow test
     │   │   ├─► Flight search test
     │   │   └─► Booking creation test
     │   │
     │   ├─► Auto-Rollback (on failure)
     │   │   ├─► ECS force-new-deployment (previous)
     │   │   └─► Slack alert
     │   │
     │   └─► Slack Notification (Success/Failure)
     │
     └─► Staging Environment Ready
```

### 4. Production Deployment

```
Git Tag v1.0.0 / Manual Trigger
     │
     ├─► 04-Deploy-Production
     │   ├─► Pre-Deployment Checks
     │   │   ├─► Version format validation
     │   │   ├─► Git tag verification
     │   │   └─► Release notes extraction
     │   │
     │   ├─► Security Approval (Environment Protection)
     │   │   ├─► Require 2 reviewer approvals
     │   │   └─► Deployment key validation
     │   │
     │   ├─► AWS Credentials Configuration
     │   │   ├─► STS assume role with session
     │   │   └─► ECR login
     │   │
     │   ├─► ECS Deployment
     │   │   ├─► Backend deployment
     │   │   ├─► Frontend deployment
     │   │   └─► Wait for service stability
     │   │
     │   ├─► Database Migrations (Production)
     │   │   ├─► Hourly automated backup first
     │   │   ├─► Zero-downtime migration
     │   │   └─► Verification
     │   │
     │   ├─► Post-Deployment Tests (Parallel)
     │   │   ├─► E2E tests (complete user flows)
     │   │   ├─► Performance tests (k6 load)
     │   │   └─► Synthetic monitoring
     │   │
     │   ├─► Monitoring Setup
     │   │   ├─► CloudWatch alarms update
     │   │   ├─► Detailed metrics enabled
     │   │   └─► Alert thresholds set
     │   │
     │   ├─► GitHub Release Update
     │   │   └─► Changelog + Release notes
     │   │
     │   ├─► Auto-Rollback (on test failure)
     │   │   ├─► ECS force-new-deployment
     │   │   ├─► Previous version restored
     │   │   └─► Critical Slack alert
     │   │
     │   └─► Slack Notification (Detailed)
     │
     └─► Production Environment Updated
```

## Database Migration Workflow

```
Migration Trigger
     │
     ├─► Validate Migrations
     │   ├─► Scan migration files
     │   ├─► TypeORM show current state
     │   └─► Check for conflicts
     │
     ├─► Backup Database
     │   ├─► pg_dump + gzip
     │   ├─► Upload to S3
     │   ├─► Log to DynamoDB
     │   └─► Verify backup integrity
     │
     ├─► Run Migrations
     │   ├─► Retrieve DB credentials from Secrets Manager
     │   ├─► TypeORM migration:run
     │   ├─► Log all changes
     │   └─► Retry on transient failures
     │
     ├─► Verify Migration
     │   ├─► Check schema against expected state
     │   ├─► Validate data integrity
     │   └─► Performance checks
     │
     └─► Success / Rollback
         ├─ Success: Notification sent
         └─ Failure: Restore from backup
```

## Security Scanning Workflow

```
Security Compliance Job
     │
     ├─► Dependency Scanning
     │   ├─ npm audit (CRITICAL,HIGH)
     │   ├─ Snyk scan (JSON output)
     │   └─ License checking (CSV)
     │
     ├─► Container Image Scanning
     │   ├─ Trivy file scan (fs)
     │   ├─ Checkov infrastructure (Dockerfile)
     │   └─ SBOM generation (SPDX)
     │
     ├─► Secret Detection
     │   ├─ GitGuardian scan
     │   ├─ TruffleHog deep search
     │   └─ Pattern matching
     │
     ├─► SAST (Static Analysis)
     │   ├─ SonarCloud scan
     │   ├─ ESLint security plugin
     │   └─ Type checking (strict mode)
     │
     ├─► CodeQL Analysis
     │   ├─ Initialize CodeQL DB
     │   ├─ Analyze TypeScript/JavaScript
     │   └─ Upload to GitHub
     │
     └─► Results
         ├─ SARIF upload to Security tab
         ├─ Failed checks block merge
         └─ Reports available in artifacts
```

## Performance Testing Workflow

```
Scheduled: 02:00 UTC Daily / Manual Trigger
     │
     ├─► Load Test (50 VUs, 10 min)
     │   ├─ Ramp up: 0 → 50 users
     │   ├─ Steady: 50 users for 5 min
     │   ├─ Ramp down: 50 → 0
     │   └─ Metrics: Latency, Throughput
     │
     ├─► Stress Test (500 VUs, 5 min)
     │   ├─ Find breaking point
     │   ├─ Monitor error rates
     │   └─ Track resource usage
     │
     ├─► Soak Test (10 VUs, 30 min)
     │   ├─ Find memory leaks
     │   ├─ Monitor connections
     │   └─ Check cache efficiency
     │
     ├─► Spike Test
     │   ├─ Normal: 10 VUs
     │   ├─ Spike: Instant 1000 VUs
     │   ├─ Recovery: Back to 10 VUs
     │   └─ Measure recovery time
     │
     ├─► Synthetic Monitoring
     │   ├─ API endpoint checks
     │   ├─ Business transaction flows
     │   └─ Content validation
     │
     └─► Results
         ├─ k6 JSON output
         ├─ HTML reports with charts
         ├─ Comparison with baseline
         └─ Artifacts stored for 30 days
```

## Monitoring & Observability Workflow

```
Runs Every 5 Minutes / On-Demand
     │
     ├─► Health Checks
     │   ├─ Backend API /health endpoint
     │   ├─ Frontend homepage status
     │   ├─ Database connection test
     │   ├─ Redis connectivity
     │   └─ RabbitMQ queue status
     │
     ├─► Uptime Verification
     │   ├─ CloudWatch ALB metrics
     │   ├─ Response time (p50, p95, p99)
     │   ├─ Request count per second
     │   └─ HTTP error rate
     │
     ├─► Log Analysis
     │   ├─ CloudWatch Logs queries
     │   ├─ Error rate extraction
     │   ├─ Pattern detection
     │   └─ Anomaly identification
     │
     ├─► Metrics Export
     │   ├─ ECS CPU/Memory utilization
     │   ├─ RDS database metrics
     │   ├─ ElastiCache hit rate
     │   └─ ALB response times
     │
     ├─► SLA Compliance Check
     │   ├─ 99.9% uptime target
     │   ├─ <2s p95 latency
     │   ├─ <0.1% error rate
     │   └─ Alert if threshold exceeded
     │
     ├─► Incident Detection
     │   ├─ Anomaly detection
     │   ├─ Threshold breaches
     │   ├─ Auto-create GitHub issue
     │   └─ Slack critical alert
     │
     └─► Notifications
         ├─ Slack channel updates
         ├─ Email alerts for critical
         ├─ PagerDuty incidents
         └─ Dashboard updates
```

## Infrastructure Components

### AWS ECS Services

```
┌─ airline-booking-staging (Cluster)
│  ├─ airline-booking-backend-staging (Service)
│  │  ├─ 2-4 task instances
│  │  ├─ CPU: 512, Memory: 1024 MB
│  │  ├─ Autoscaling: CPU >70%
│  │  └─ Load Balancer: Application ELB
│  │
│  └─ airline-booking-frontend-staging (Service)
│     ├─ 2-4 task instances
│     ├─ CPU: 256, Memory: 512 MB
│     ├─ Autoscaling: CPU >80%
│     └─ CDN: CloudFront distribution
│
└─ airline-booking-prod (Cluster)
   ├─ airline-booking-backend-prod (Service)
   │  ├─ 4-10 task instances
   │  ├─ CPU: 1024, Memory: 2048 MB
   │  ├─ Autoscaling: CPU >60%, Memory >70%
   │  ├─ Load Balancer: Application ELB (Multi-AZ)
   │  └─ Service mesh: App Mesh for observability
   │
   └─ airline-booking-frontend-prod (Service)
      ├─ 4-8 task instances
      ├─ CPU: 512, Memory: 1024 MB
      ├─ Autoscaling: CPU >70%
      ├─ Load Balancer: Application ELB (Multi-AZ)
      └─ CDN: CloudFront (global distribution)
```

### Database Architecture

```
Staging (Single Instance):
  ├─ Instance: db.t3.micro
  ├─ Storage: 100 GB gp3
  ├─ Backups: Daily, 7-day retention
  ├─ MultiAZ: No (cost optimization)
  └─ Monitoring: Enhanced monitoring enabled

Production (Multi-AZ):
  ├─ Primary: db.r5.xlarge (us-east-1a)
  ├─ Standby: db.r5.xlarge (us-east-1b)
  ├─ Storage: 500 GB gp3
  ├─ Backups: Hourly, 30-day retention + PITR
  ├─ MultiAZ: Yes (high availability)
  ├─ Monitoring: Enhanced + Performance Insights
  └─ Failover: Automatic (< 2 min RTO)
```

### Caching Layer

```
Staging Redis:
  ├─ Node type: cache.t3.micro
  ├─ Engine: redis:7-alpine
  ├─ Replication: No
  └─ Memory: 0.346 GB

Production Redis:
  ├─ Node type: cache.r5.large (multi-node)
  ├─ Engine: redis:7-alpine
  ├─ Replication: Yes (read replicas)
  ├─ Automatic failover: Enabled
  ├─ Memory: 16 GB per node
  └─ Sharding: Enabled for horizontal scaling
```

### Storage

```
S3 Buckets:
├─ airline-booking-staging: Staging assets/documents
├─ airline-booking-prod: Production assets/documents
├─ airline-booking-backups: Database backups (versioning enabled)
└─ airline-booking-artifacts: CI/CD artifacts (30-day expiry)

CloudFront Distributions:
├─ Frontend Staging CDN: staging-web.airline-booking.dev
└─ Frontend Production CDN: airline-booking.com
```

## Failure Recovery

### Automatic Rollback Process

```
Deployment Failure Detected
     │
     ├─► Option 1: Test Failure
     │   ├─ Smoke tests failed
     │   ├─ E2E tests failed
     │   └─ Action: Auto-rollback to previous task definition
     │
     ├─► Option 2: Health Check Failure
     │   ├─ Service not responding after 15 min
     │   ├─ Error rate > 5%
     │   └─ Action: Auto-rollback
     │
     ├─► Option 3: Manual Intervention
     │   ├─ 2-hour window to approve rollback
     │   ├─ Requires environment protection approval
     │   └─ Action: Manual rollback workflow
     │
     └─► Rollback Steps
         ├─ Retrieve previous task definition ARN
         ├─ Update ECS service with previous version
         ├─ Force new deployment
         ├─ Wait for service stability
         ├─ Run health checks
         └─ Send alert to Slack
```

## Security & Compliance

```
Security Layers:

1. Code Level:
   ├─ ESLint with security rules
   ├─ TypeScript strict mode
   ├─ Input validation (Zod)
   └─ SQL injection prevention

2. Pipeline Level:
   ├─ Dependency scanning (npm audit, Snyk)
   ├─ SAST (SonarCloud, CodeQL)
   ├─ Secret scanning (GitGuardian, TruffleHog)
   └─ License compliance (license-checker)

3. Container Level:
   ├─ Image scanning (Trivy, Grype)
   ├─ Dockerfile linting (Checkov)
   ├─ SBOM generation
   └─ Image signing (Cosign)

4. Infrastructure Level:
   ├─ AWS IAM roles (least privilege)
   ├─ VPC security groups
   ├─ Encryption at rest (RDS, S3)
   ├─ Encryption in transit (TLS 1.3)
   └─ VPC endpoints for private access

5. Compliance:
   ├─ PCI-DSS (Payment Card Data Security)
   ├─ GDPR (Data Protection)
   ├─ SOC 2 (Security & Availability)
   └─ ISO 27001 (Information Security)
```

## Observability Stack

```
Logging:
├─ CloudWatch Logs (ECS task logs)
├─ Application logs in JSON format
├─ Structured logging with trace IDs
└─ Log retention: 30 days production, 7 days staging

Metrics:
├─ CloudWatch Metrics (custom + standard)
├─ Prometheus (optional for local testing)
├─ Application performance metrics
└─ SLA metrics (uptime, latency, error rate)

Tracing:
├─ AWS X-Ray (distributed tracing)
├─ OpenTelemetry SDKs
├─ Transaction tracing across services
└─ Performance bottleneck identification

Alerting:
├─ CloudWatch Alarms (SNS → Slack)
├─ PagerDuty integration
├─ Custom metrics dashboard
└─ On-call rotations
```

---

**Document Version:** 1.0.0  
**Last Updated:** April 2026  
**Author:** DevOps Team  
**Status:** Production Ready
