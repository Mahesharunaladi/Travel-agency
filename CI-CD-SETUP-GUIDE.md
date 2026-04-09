# 🚀 Complete CI/CD Setup Guide - Airline Booking System

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Secrets Setup](#github-secrets-setup)
4. [Workflow Configuration](#workflow-configuration)
5. [AWS Infrastructure](#aws-infrastructure)
6. [Local Development Setup](#local-development-setup)
7. [Testing the Pipelines](#testing-the-pipelines)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
9. [Best Practices](#best-practices)

## Overview

This CI/CD pipeline is designed for a production-grade airline booking system with:
- **8 Automated Workflows** for different stages of development and deployment
- **Multi-Environment Support** (staging, production)
- **Security-First Approach** with automated scanning and compliance checks
- **Zero-Downtime Deployments** with automatic rollback capabilities
- **Comprehensive Monitoring** with real-time alerts

### Pipeline Stages

```
Code Push/PR → Lint & Test → Build & Push → Deploy Staging → Deploy Production
     ↓            ↓             ↓               ↓              ↓
  GitHub      Validate      Docker          ECS            ECS
   Commit      Code         Images        Deployment    Deployment
```

## Prerequisites

### Required Tools
- Git
- GitHub CLI (gh)
- AWS CLI v2
- Docker & Docker Compose
- Node.js 18+
- npm or yarn

### Required Accounts
- GitHub (with repository access)
- AWS (with appropriate IAM permissions)
- Snyk (for dependency scanning)
- SonarCloud (for code quality)
- Slack (for notifications)

### IAM Permissions

Create IAM roles with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:*",
        "ec2:*",
        "rds:*",
        "elasticache:*",
        "s3:*",
        "ecr:*",
        "cloudwatch:*",
        "logs:*",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

## GitHub Secrets Setup

### 1. Create Required Secrets

```bash
# Navigate to repository Settings → Secrets and variables → Actions
# Add the following secrets:
```

### AWS Credentials

```bash
gh secret set AWS_ACCESS_KEY_ID_STAGING -b "your-staging-access-key"
gh secret set AWS_SECRET_ACCESS_KEY_STAGING -b "your-staging-secret-key"
gh secret set AWS_ACCESS_KEY_ID_PROD -b "your-prod-access-key"
gh secret set AWS_SECRET_ACCESS_KEY_PROD -b "your-prod-secret-key"
gh secret set AWS_ACCOUNT_ID -b "123456789012"
gh secret set AWS_REGION -b "us-east-1"
gh secret set AWS_ROLE_TO_ASSUME -b "arn:aws:iam::123456789012:role/GitHubActionsRole"
```

### Database Credentials

```bash
gh secret set DB_HOST_STAGING -b "staging-db.rds.amazonaws.com"
gh secret set DB_USER_STAGING -b "postgres"
gh secret set DB_NAME_STAGING -b "airline_booking_staging"
gh secret set DB_PASSWORD_STAGING -b "$(openssl rand -base64 32)"

gh secret set DB_HOST_PROD -b "prod-db.rds.amazonaws.com"
gh secret set DB_USER_PROD -b "postgres"
gh secret set DB_NAME_PROD -b "airline_booking_prod"
gh secret set DB_PASSWORD_PROD -b "$(openssl rand -base64 32)"
```

### Third-Party API Keys

```bash
# Payment Gateway
gh secret set RAZORPAY_KEY_ID -b "your-razorpay-key"
gh secret set RAZORPAY_KEY_SECRET -b "your-razorpay-secret"
gh secret set RAZORPAY_WEBHOOK_SECRET -b "your-webhook-secret"

# GDS Integration
gh secret set AMADEUS_CLIENT_ID -b "your-amadeus-client-id"
gh secret set AMADEUS_CLIENT_SECRET -b "your-amadeus-client-secret"

# Email Service
gh secret set SENDGRID_API_KEY -b "your-sendgrid-api-key"

# SMS Service
gh secret set TWILIO_ACCOUNT_SID -b "your-twilio-sid"
gh secret set TWILIO_AUTH_TOKEN -b "your-twilio-token"
gh secret set TWILIO_PHONE_NUMBER -b "+1234567890"
```

### Security & Monitoring

```bash
gh secret set SNYK_TOKEN -b "your-snyk-token"
gh secret set SONAR_TOKEN -b "your-sonarcloud-token"
gh secret set GITGUARDIAN_API_KEY -b "your-gitguardian-key"
gh secret set SENTRY_AUTH_TOKEN -b "your-sentry-token"

# Slack for notifications
gh secret set SLACK_WEBHOOK_URL -b "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
gh secret set SLACK_WEBHOOK_URL_STAGING -b "https://hooks.slack.com/services/YOUR/STAGING/WEBHOOK"
gh secret set SLACK_WEBHOOK_URL_PROD -b "https://hooks.slack.com/services/YOUR/PROD/WEBHOOK"
```

### AWS S3 & Backups

```bash
gh secret set AWS_BACKUP_BUCKET -b "airline-booking-backups"
gh secret set AWS_S3_BUCKET_STAGING -b "airline-booking-staging"
gh secret set AWS_S3_BUCKET_PROD -b "airline-booking-prod"
```

### Frontend Build Variables

```bash
gh secret set NEXT_PUBLIC_API_URL -b "https://api.airline-booking.com"
gh secret set NEXT_PUBLIC_PAYMENT_KEY -b "your-razorpay-public-key"
```

### Test Users

```bash
gh secret set TEST_USER_EMAIL -b "test@airline-booking.com"
gh secret set TEST_USER_PASSWORD -b "$(openssl rand -base64 32)"
```

## Workflow Configuration

### 1. Enable GitHub Actions

```bash
# In repository settings, enable GitHub Actions
gh repo edit --enable-issues --enable-projects --enable-wiki
```

### 2. Configure Branch Protection Rules

```
For 'main' branch:
- Require pull request reviews before merging
- Dismiss stale pull request approvals
- Require status checks to pass before merging
- Require branches to be up to date before merging

Status checks required:
- 01: Lint & Test
- 02: Build & Push
- Security & Compliance
```

### 3. Setup Repository Environments

```
Settings → Environments → Create environments:

Staging:
- URL: https://staging-api.airline-booking.dev
- Deployment branches: develop, staging

Production:
- URL: https://api.airline-booking.com
- Deployment branches: main (tags only)
- Required reviewers: 2 team members
- Restrict deployments to deployment keys
```

## AWS Infrastructure

### 1. Create ECS Clusters

```bash
# Staging cluster
aws ecs create-cluster \
  --cluster-name airline-booking-staging \
  --region us-east-1

# Production cluster  
aws ecs create-cluster \
  --cluster-name airline-booking-prod \
  --region us-east-1
```

### 2. Create RDS Databases

```bash
# Staging database
aws rds create-db-instance \
  --db-instance-identifier airline-booking-staging-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 100 \
  --master-username postgres \
  --region us-east-1

# Production database (Multi-AZ)
aws rds create-db-instance \
  --db-instance-identifier airline-booking-prod-db \
  --db-instance-class db.r5.xlarge \
  --engine postgres \
  --allocated-storage 500 \
  --master-username postgres \
  --multi-az \
  --backup-retention-period 30 \
  --region us-east-1
```

### 3. Create ECR Repositories

```bash
# Backend repository
aws ecr create-repository \
  --repository-name airline-booking/backend \
  --region us-east-1

# Frontend repository
aws ecr create-repository \
  --repository-name airline-booking/frontend \
  --region us-east-1
```

### 4. Create ElastiCache Clusters

```bash
# Staging cache
aws elasticache create-cache-cluster \
  --cache-cluster-id airline-booking-staging-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --region us-east-1

# Production cache (Multi-AZ)
aws elasticache create-replication-group \
  --replication-group-description "Airline Booking Production Cache" \
  --replication-group-id airline-booking-prod-cache \
  --cache-node-type cache.r5.large \
  --engine redis \
  --automatic-failover-enabled \
  --region us-east-1
```

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Travel-agency.git
cd Travel-agency
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3. Setup Environment Files

```bash
# Copy example environment
cp .env.example .env.development.local

# Edit with local values
nano .env.development.local
```

### 4. Start Services with Docker Compose

```bash
docker-compose up -d

# This starts:
# - PostgreSQL
# - Redis
# - RabbitMQ
# - Backend service
# - Frontend service
```

### 5. Run Database Migrations

```bash
cd backend
npm run typeorm migration:run
cd ..
```

## Testing the Pipelines

### 1. Test Lint and Test Workflow

```bash
# Create a feature branch
git checkout -b feature/test-ci

# Make a code change
echo "// test" >> backend/src/main.ts

# Commit and push
git add .
git commit -m "test: ci pipeline"
git push origin feature/test-ci

# Create PR on GitHub
gh pr create --title "Test CI Pipeline" --body "Testing workflows"

# Watch the workflow run
gh run list --branch feature/test-ci
```

### 2. Test Build Workflow

```bash
# After successful tests, tag a release
git tag v0.1.0
git push origin v0.1.0

# Watch build workflow
gh run list --event push
```

### 3. Test Staging Deployment

```bash
# Merge PR to develop branch
git checkout develop
git pull origin develop

# Push to trigger staging deployment
git push

# Monitor deployment
gh run list --event push
```

### 4. Test Production Deployment

```bash
# Create release on GitHub
gh release create v1.0.0 --generate-notes

# This triggers production deployment workflow
# Monitor progress
gh run list --event push
```

## Monitoring & Troubleshooting

### 1. View Workflow Logs

```bash
# List all workflows
gh workflow list

# View specific workflow runs
gh run list --workflow 01-lint-and-test.yml

# View run details
gh run view <run-id>

# Stream logs
gh run view <run-id> --log
```

### 2. Common Issues & Solutions

#### Issue: "Workflow not triggering"
Solution: Check branch protection rules and workflow triggers

```bash
# Verify workflow is enabled
gh workflow list

# Check branch name matches trigger
git branch -a
```

#### Issue: "AWS credentials error"
Solution: Verify GitHub secrets are set correctly

```bash
# List all secrets (values hidden)
gh secret list

# Re-set credentials
gh secret set AWS_ACCESS_KEY_ID_STAGING -b "new-key"
```

#### Issue: "Docker build fails"
Solution: Check Dockerfile and build arguments

```bash
# Build locally
docker build -t airline-booking-backend:test ./backend

# View build logs
docker build --progress=plain -t airline-booking-backend:test ./backend
```

#### Issue: "Database migration fails"
Solution: Check database connection and migration files

```bash
# Test connection locally
psql $DATABASE_URL -c "SELECT 1"

# View migration status
cd backend
npm run typeorm -- migration:show
```

### 3. Enable Debug Logging

```bash
# For GitHub Actions
gh workflow run --debug-mode 01-lint-and-test.yml

# Add to workflow file
- name: Enable debug
  if: runner.debug == '1'
  run: echo "::debug::Debug mode enabled"
```

## Best Practices

### 1. Code Quality
- ✅ Maintain >80% code coverage
- ✅ Fix all ESLint errors before committing
- ✅ Run tests locally before pushing
- ✅ Use conventional commits

### 2. Security
- ✅ Never commit secrets or API keys
- ✅ Use GitHub Secrets for sensitive data
- ✅ Review security scan results before merge
- ✅ Keep dependencies updated

### 3. Deployment
- ✅ Always deploy to staging first
- ✅ Run smoke tests after staging deployment
- ✅ Use semantic versioning for releases
- ✅ Keep deployment history and logs

### 4. Monitoring
- ✅ Check health metrics after deployment
- ✅ Monitor error rates and latency
- ✅ Set up alerting for critical metrics
- ✅ Review logs regularly

### 5. Documentation
- ✅ Update README with new features
- ✅ Document architecture decisions
- ✅ Keep runbooks current
- ✅ Share knowledge with team

## Quick Reference

### Common Commands

```bash
# Create and test feature
git checkout -b feature/my-feature
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
gh pr create

# Deploy to staging
git checkout develop
git merge --no-ff feature/my-feature
git push

# Release to production
git checkout main
git merge --no-ff develop
git tag v1.0.0
git push --tags

# Rollback production
gh workflow run 04-deploy-production.yml -f rollback=true

# Check deployment status
gh run list -w "Deploy Production"
gh run view <run-id> --log
```

### Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Support

For issues or questions:
1. Check workflow logs: `gh run view <run-id> --log`
2. Review AWS CloudWatch logs
3. Check service health: `curl https://staging-api.airline-booking.dev/health`
4. Contact DevOps team

---

**Last Updated:** April 2026  
**Maintained By:** DevOps Team  
**Version:** 1.0.0
